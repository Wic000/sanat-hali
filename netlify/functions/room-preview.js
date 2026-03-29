const OPENAI_API_URL = 'https://api.openai.com/v1/images/edits';

const dataUrlToBlob = async (dataUrl) => {
  const response = await fetch(dataUrl);
  return response.blob();
};

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing OPENAI_API_KEY' }),
      };
    }

    const { basePreviewImage, productName, placementMode = 'center', roomWidth, roomHeight } = JSON.parse(event.body || '{}');

    if (!basePreviewImage || !productName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing base preview image or product name' }),
      };
    }

    const formData = new FormData();
    formData.append('model', process.env.OPENAI_ROOM_PREVIEW_MODEL || 'gpt-image-1');
    formData.append(
      'prompt',
      [
        `Refine this carpet-in-room preview into a realistic premium showroom render for the carpet "${productName}".`,
        'Keep the same room architecture, furniture layout, wall colors, and perspective.',
        'Do not change the room itself: preserve people, objects, doors, walls, windows, furniture, flooring, and camera angle.',
        'Keep the carpet design recognizable and naturally blended into the floor.',
        `Placement style should remain ${placementMode === 'coverage' ? 'room-covering and wider' : 'centered and focal'}.`,
        'Add realistic contact shadows, floor perspective, and room lighting.',
        `Room reference size: width ${roomWidth || 'unknown'} meters, height ${roomHeight || 'unknown'} meters.`,
      ].join(' ')
    );
    formData.append('size', '1024x1024');
    formData.append('quality', 'medium');
    formData.append('image', await dataUrlToBlob(basePreviewImage), 'room-preview-base.jpg');

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    const payload = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: payload?.error?.message || payload?.message || 'OpenAI image request failed',
        }),
      };
    }

    const imageBase64 = payload?.data?.[0]?.b64_json;
    const imageUrl = imageBase64 ? `data:image/png;base64,${imageBase64}` : null;

    if (!imageUrl) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'OpenAI did not return an image preview' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        provider: 'openai',
        image: imageUrl,
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
