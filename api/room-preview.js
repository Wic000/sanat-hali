const OPENAI_API_URL = 'https://api.openai.com/v1/images/edits';

const dataUrlToBlob = async (dataUrl) => {
  const response = await fetch(dataUrl);

  if (!response.ok) {
    throw new Error('Failed to read uploaded room image');
  }

  return response.blob();
};

const absoluteImageUrl = (req, imagePath) => {
  if (!imagePath) {
    return '';
  }

  if (/^https?:\/\//i.test(imagePath) || imagePath.startsWith('data:')) {
    return imagePath;
  }

  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;

  return `${protocol}://${host}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
};

const fetchImageAsBlob = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch carpet image');
  }

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
      roomImage,
      rugImage,
      productName,
      placementMode = 'center',
      roomWidth,
      roomHeight,
    } = req.body || {};

    if (!roomImage || !rugImage || !productName) {
      return res.status(400).json({ error: 'Missing room image, rug image, or product name' });
    }

    const roomBlob = await dataUrlToBlob(roomImage);
    const rugBlob = await fetchImageAsBlob(absoluteImageUrl(req, rugImage));

    const formData = new FormData();
    formData.append('model', process.env.OPENAI_ROOM_PREVIEW_MODEL || 'gpt-image-1');
    formData.append(
      'prompt',
      [
        `Create a photorealistic interior preview using the provided room photo and the provided carpet product image named "${productName}".`,
        `Keep the uploaded room composition, furniture, walls, and lighting as realistic as possible.`,
        `Place the carpet on the visible floor in ${placementMode === 'coverage' ? 'a larger room-covering layout' : 'a centered focal layout'}.`,
        `Use realistic perspective, scale, and soft floor contact shadows.`,
        `Do not change the carpet pattern or invent a new design.`,
        `Room size reference: width ${roomWidth || 'unknown'} meters, height ${roomHeight || 'unknown'} meters.`,
        'Return a polished premium showroom-style preview image.',
      ].join(' ')
    );
    formData.append('size', '1024x1536');
    formData.append('quality', 'medium');
    formData.append('input_fidelity', 'high');
    formData.append('image[]', roomBlob, 'room.jpg');
    formData.append('image[]', rugBlob, 'rug.png');

    const openAiResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    const payload = await openAiResponse.json();

    if (!openAiResponse.ok) {
      return res.status(openAiResponse.status).json({
        error: payload?.error?.message || 'OpenAI image edit request failed',
      });
    }

    const base64Image = payload?.data?.[0]?.b64_json;

    if (!base64Image) {
      return res.status(500).json({ error: 'OpenAI did not return an image preview' });
    }

    return res.status(200).json({
      ok: true,
      provider: 'openai',
      image: `data:image/png;base64,${base64Image}`,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
}
