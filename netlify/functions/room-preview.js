const OPENAI_API_URL = 'https://api.openai.com/v1/images/edits';

const dataUrlToBlob = async (dataUrl) => {
  const response = await fetch(dataUrl);

  if (!response.ok) {
    throw new Error('Failed to read preview image');
  }

  return response.blob();
};

exports.handler = async (event) => {
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
      basePreviewImage,
      productName,
      placementMode = 'center',
      roomWidth,
      roomHeight,
    } = JSON.parse(event.body || '{}');

    if (!basePreviewImage || !productName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing base preview image or product name' }),
      };
    }

    const previewBlob = await dataUrlToBlob(basePreviewImage);
    const formData = new FormData();
    formData.append('model', process.env.OPENAI_ROOM_PREVIEW_MODEL || 'gpt-image-1');
    formData.append(
      'prompt',
      [
        `Refine this carpet-in-room preview into a realistic premium showroom render for the carpet "${productName}".`,
        'Keep the exact room layout, furniture placement, and wall colors from the input image.',
        'Keep the carpet pattern and border recognizable from the preview image.',
        `Make the carpet feel naturally placed on the floor in a ${placementMode === 'coverage' ? 'larger room-covering' : 'centered focal'} layout.`,
        'Blend the rug with realistic contact shadows, floor perspective, and room lighting.',
        'Do not remove the carpet, do not replace it with another object, and do not transform the room into a different location.',
        `Room reference size: width ${roomWidth || 'unknown'} meters, height ${roomHeight || 'unknown'} meters.`,
      ].join(' ')
    );
    formData.append('size', '1024x1536');
    formData.append('quality', 'medium');
    formData.append('input_fidelity', 'high');
    formData.append('image[]', previewBlob, 'base-preview.jpg');

    const openAiResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    const payload = await openAiResponse.json();

    if (!openAiResponse.ok) {
      return {
        statusCode: openAiResponse.status,
        body: JSON.stringify({
          error: payload?.error?.message || 'OpenAI image edit request failed',
        }),
      };
    }

    const base64Image = payload?.data?.[0]?.b64_json;

    if (!base64Image) {
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
};
