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

    const {
      roomBaseImage,
      rugReferenceImage,
      maskImage,
      basePreviewImage,
      productName,
      placementMode = 'center',
      roomWidth,
      roomHeight,
    } = JSON.parse(event.body || '{}');

    const primaryImage = roomBaseImage || basePreviewImage;

    if (!primaryImage || !productName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing room image or product name' }),
      };
    }

    const formData = new FormData();
    formData.append('model', process.env.OPENAI_ROOM_PREVIEW_MODEL || 'gpt-image-1');
    formData.append(
      'prompt',
      [
        `Refine this carpet-in-room preview into a realistic premium showroom render for the carpet "${productName}".`,
        rugReferenceImage ? 'Use the carpet from the second input image as the exact reference carpet.' : 'Keep the carpet already visible in the image as the exact reference carpet.',
        maskImage ? 'Only edit the masked carpet area on the first image.' : 'Only refine the carpet area and keep the room unchanged.',
        'Do not change any unmasked region of the room.',
        'Keep the same room architecture, furniture layout, wall colors, flooring pattern, people, objects, and camera perspective exactly as they are.',
        'Do not add or remove any extra details, furniture, decor, windows, doors, shadows, or people.',
        'Keep the carpet design, border, color palette, and ornament recognizable and naturally blended into the existing floor without changing the room itself.',
        `Placement style should remain ${placementMode === 'coverage' ? 'room-covering and wider' : 'centered and focal'}.`,
        'Add only subtle realistic contact shadow around the carpet edges inside the masked area.',
        `Room reference size: width ${roomWidth || 'unknown'} meters, height ${roomHeight || 'unknown'} meters.`,
      ].join(' ')
    );
    formData.append('size', '1024x1024');
    formData.append('quality', 'medium');
    formData.append('input_fidelity', 'high');
    formData.append('image', await dataUrlToBlob(primaryImage), 'room-preview-room.png');
    if (rugReferenceImage) {
      formData.append('image', await dataUrlToBlob(rugReferenceImage), 'room-preview-rug.png');
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
