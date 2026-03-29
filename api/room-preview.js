const OPENAI_API_URL = 'https://api.openai.com/v1/images/edits';

const dataUrlToBlob = async (dataUrl) => {
  const response = await fetch(dataUrl);
  return response.blob();
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });
    }

    const {
      roomBaseImage,
      rugReferenceImage,
      maskImage,
      basePreviewImage,
      productName,
      placementMode = 'center',
      roomWidth,
      roomHeight,
    } = req.body || {};

    const primaryImage = roomBaseImage || basePreviewImage;

    if (!primaryImage || !productName) {
      return res.status(400).json({ error: 'Missing room image or product name' });
    }

    const formData = new FormData();
    formData.append('model', process.env.OPENAI_ROOM_PREVIEW_MODEL || 'gpt-image-1');
    formData.append(
      'prompt',
      [
        `Refine this carpet-in-room preview into a realistic premium showroom render for the carpet "${productName}".`,
        rugReferenceImage ? 'Use the carpet from the second input image as the exact reference carpet.' : 'Keep the carpet already visible in the image as the exact reference carpet.',
        maskImage ? 'Only edit the masked carpet area on the first image.' : 'Refine the carpet placement while keeping the original room recognizable.',
        'Preserve the same room, same furniture, same objects, same people, same walls, same floor layout, and same camera angle.',
        'Do not add any extra furniture, decor, electronics, boxes, windows, doors, lamps, people, pets, or objects that are not already present.',
        'Do not remove existing furniture or objects either.',
        'Do not redesign the room. Keep it as the same room, only make the carpet look naturally placed and realistic.',
        'Keep the carpet design, border, color palette, and ornament recognizable and naturally blended into the existing floor.',
        `Placement style should remain ${placementMode === 'coverage' ? 'room-covering and wider' : 'centered and focal'}.`,
        'Add only subtle realistic contact shadow around the carpet edges and keep lighting consistent with the original photo.',
        `Room reference size: width ${roomWidth || 'unknown'} meters, height ${roomHeight || 'unknown'} meters.`,
      ].join(' ')
    );
    formData.append('size', '1024x1024');
    formData.append('quality', 'medium');
    formData.append('input_fidelity', 'high');
    formData.append('image[]', await dataUrlToBlob(primaryImage), 'room-preview-room.png');
    if (rugReferenceImage) {
      formData.append('image[]', await dataUrlToBlob(rugReferenceImage), 'room-preview-rug.png');
    }
    if (maskImage) {
      formData.append('mask', await dataUrlToBlob(maskImage), 'room-preview-mask.png');
    }

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    const payload = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: payload?.error?.message || payload?.message || 'OpenAI image request failed',
      });
    }

    const imageBase64 = payload?.data?.[0]?.b64_json;
    const imageUrl = imageBase64 ? `data:image/png;base64,${imageBase64}` : null;

    if (!imageUrl) {
      return res.status(500).json({ error: 'OpenAI did not return an image preview' });
    }

    return res.status(200).json({
      ok: true,
      provider: 'openai',
      image: imageUrl,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
}
