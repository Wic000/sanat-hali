import { InferenceClient } from '@huggingface/inference';

const DEFAULT_MODEL = 'black-forest-labs/FLUX.1-Kontext-Dev';

const dataUrlToBlob = async (dataUrl) => {
  const response = await fetch(dataUrl);

  if (!response.ok) {
    throw new Error('Failed to read preview image');
  }

  return response.blob();
};

const blobToDataUrl = async (blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const mimeType = blob.type || 'image/png';

  return `data:${mimeType};base64,${base64}`;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const accessToken = process.env.HF_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({ error: 'Missing HF_ACCESS_TOKEN' });
    }

    const {
      basePreviewImage,
      productName,
      placementMode = 'center',
      roomWidth,
      roomHeight,
    } = req.body || {};

    if (!basePreviewImage || !productName) {
      return res.status(400).json({ error: 'Missing base preview image or product name' });
    }

    const client = new InferenceClient(accessToken);
    const previewBlob = await dataUrlToBlob(basePreviewImage);
    const resultBlob = await client.imageToImage({
      provider: 'hf-inference',
      model: process.env.HF_ROOM_PREVIEW_MODEL || DEFAULT_MODEL,
      inputs: previewBlob,
      parameters: {
        prompt: [
          `Refine this carpet-in-room preview into a realistic premium showroom render for the carpet "${productName}".`,
          'Keep the exact room layout, camera angle, furniture placement, and wall colors from the input image.',
          'Keep the carpet pattern, border design, and palette recognizable from the input preview.',
          `Make the carpet feel naturally placed on the floor in a ${placementMode === 'coverage' ? 'larger room-covering' : 'centered focal'} layout.`,
          'Blend the rug with realistic floor contact shadows, perspective, and lighting so it no longer looks pasted on top.',
          'Do not remove the carpet, do not replace it with another object, and do not change the room into a different location.',
          `Room reference size: width ${roomWidth || 'unknown'} meters, height ${roomHeight || 'unknown'} meters.`,
        ].join(' '),
        negative_prompt: [
          'floating carpet',
          'tiny rug',
          'blank floor',
          'missing rug',
          'extra furniture',
          'warped room',
          'cropped carpet',
          'text',
          'watermark',
        ].join(', '),
        guidance_scale: 6,
        num_inference_steps: 18,
        target_size: {
          width: 768,
          height: 1024,
        },
      },
    });

    return res.status(200).json({
      ok: true,
      provider: 'huggingface',
      image: await blobToDataUrl(resultBlob),
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
}
