const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const extractImageUrl = (payload) => {
  const message = payload?.choices?.[0]?.message;
  const imageEntry =
    message?.images?.[0]?.image_url?.url ||
    message?.images?.[0]?.image_url ||
    message?.image_url?.url ||
    message?.image_url ||
    null;

  if (imageEntry) {
    return imageEntry;
  }

  const content = Array.isArray(message?.content) ? message.content : [];
  const imageContent = content.find((item) => item?.type === 'image_url' || item?.type === 'output_image');

  return imageContent?.image_url?.url || imageContent?.image_url || imageContent?.url || null;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Missing OPENROUTER_API_KEY' });
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

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': req.headers.origin || req.headers.referer || 'https://sanat-hali.app',
        'X-Title': 'Sanat Hali Mini App',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_IMAGE_MODEL || 'google/gemini-2.5-flash-image-preview',
        modalities: ['image', 'text'],
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: [
                  `Refine this carpet-in-room preview into a realistic premium showroom render for the carpet "${productName}".`,
                  'Keep the exact room layout, furniture placement, and wall colors from the image.',
                  'Keep the carpet pattern, border, and palette recognizable.',
                  `Make the carpet feel naturally placed on the floor in a ${placementMode === 'coverage' ? 'larger room-covering' : 'centered focal'} layout.`,
                  'Blend the rug with realistic contact shadows, floor perspective, and room lighting.',
                  'Do not remove the carpet, do not replace it with another object, and do not transform the room into a different location.',
                  `Room reference size: width ${roomWidth || 'unknown'} meters, height ${roomHeight || 'unknown'} meters.`,
                ].join(' '),
              },
              {
                type: 'image_url',
                image_url: {
                  url: basePreviewImage,
                },
              },
            ],
          },
        ],
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: payload?.error?.message || payload?.message || 'OpenRouter image request failed',
      });
    }

    const imageUrl = extractImageUrl(payload);

    if (!imageUrl) {
      return res.status(500).json({ error: 'OpenRouter did not return an image preview' });
    }

    return res.status(200).json({
      ok: true,
      provider: 'openrouter',
      image: imageUrl,
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
}
