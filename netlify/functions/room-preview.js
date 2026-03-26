const XAI_API_URL = 'https://api.x.ai/v1/images/edits';

const absoluteImageUrl = (event, imagePath) => {
  if (!imagePath) {
    return '';
  }

  if (/^https?:\/\//i.test(imagePath) || imagePath.startsWith('data:')) {
    return imagePath;
  }

  const protocol = event.headers['x-forwarded-proto'] || 'https';
  const host = event.headers['x-forwarded-host'] || event.headers.host;

  return `${protocol}://${host}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
};

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const apiKey = process.env.XAI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing XAI_API_KEY' }),
      };
    }

    const {
      roomImage,
      rugImage,
      productName,
      placementMode = 'center',
      roomWidth,
      roomHeight,
    } = JSON.parse(event.body || '{}');

    if (!roomImage || !rugImage || !productName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing room image, rug image, or product name' }),
      };
    }

    const response = await fetch(XAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.XAI_IMAGE_MODEL || 'grok-imagine-image',
        prompt: [
          `Create a photorealistic interior preview using the provided room photo and the provided carpet product image named "${productName}".`,
          `Keep the room architecture, furniture, walls, and lighting realistic.`,
          `Place the carpet on the visible floor in ${placementMode === 'coverage' ? 'a larger room-covering layout' : 'a centered focal layout'}.`,
          `Use realistic perspective, scale, and soft floor contact shadows.`,
          `Do not alter the carpet pattern or invent a different design.`,
          `Room size reference: width ${roomWidth || 'unknown'} meters, height ${roomHeight || 'unknown'} meters.`,
          'Return one premium showroom-style preview image.',
        ].join(' '),
        response_format: 'b64_json',
        images: [
          { image_url: roomImage },
          { image_url: absoluteImageUrl(event, rugImage) },
        ],
      }),
    });

    const rawPayload = await response.text();
    let payload = null;

    try {
      payload = rawPayload ? JSON.parse(rawPayload) : null;
    } catch {
      payload = null;
    }

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error:
            payload?.error?.message ||
            payload?.message ||
            rawPayload ||
            'xAI image edit request failed',
        }),
      };
    }

    const base64Image =
      payload?.data?.[0]?.b64_json ||
      payload?.images?.[0]?.b64_json ||
      payload?.output?.[0]?.b64_json ||
      null;

    if (!base64Image) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'xAI did not return an image preview' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        provider: 'xai',
        image: `data:image/png;base64,${base64Image}`,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown server error',
      }),
    };
  }
}
