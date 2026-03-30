const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const formatMoney = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return String(value ?? 'not provided');
  }

  return `${new Intl.NumberFormat('en-US').format(amount).replace(/,/g, ' ')} so'm`;
};

const dataUrlToBlob = async (dataUrl) => {
  const response = await fetch(dataUrl);
  return response.blob();
};

const sendTelegramPhoto = async ({ token, chatId, photoDataUrl, caption }) => {
  const formData = new FormData();
  formData.append('chat_id', String(chatId));
  formData.append('photo', await dataUrlToBlob(photoDataUrl), 'room-preview.png');
  formData.append('caption', caption);
  formData.append('parse_mode', 'HTML');

  return fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
    method: 'POST',
    body: formData,
  });
};

const sendTelegramMessage = async ({ token, chatId, text }) =>
  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const token = process.env.ORDER_BOT_TOKEN;
    const adminChatId = process.env.ADMIN_CHAT_ID;

    if (!token || !adminChatId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing ORDER_BOT_TOKEN or ADMIN_CHAT_ID' }),
      };
    }

    const { user, phone, productName, size, price, note, room } = JSON.parse(event.body || '{}');

    if (!productName || !size || !price) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required order fields' }),
      };
    }

    const firstName = user?.first_name || 'not provided';
    const lastName = user?.last_name || 'not provided';
    const username = user?.username ? `@${user.username}` : 'not provided';
    const telegramId = user?.id ? String(user.id) : 'not provided';
    const phoneValue = phone || user?.phone_number || 'not provided';
    const noteValue = note || 'not provided';
    const placementMode = room?.placementMode === 'coverage' ? 'full room coverage' : 'center placement';
    const roomWidth = room?.width || 'not provided';
    const roomHeight = room?.height || 'not provided';
    const hasRoomImage = room?.hasRoomImage ? 'yes' : 'no';
    const hasGeneratedPreview = room?.hasGeneratedPreview ? 'yes' : 'no';
    const previewImage = room?.previewImage || null;

    const text = [
      '<b>New Sanat Hali order</b>',
      '',
      `<b>First name:</b> ${escapeHtml(firstName)}`,
      `<b>Last name:</b> ${escapeHtml(lastName)}`,
      `<b>Username:</b> ${escapeHtml(username)}`,
      `<b>Telegram ID:</b> ${escapeHtml(telegramId)}`,
      `<b>Phone:</b> ${escapeHtml(phoneValue)}`,
      `<b>Product:</b> ${escapeHtml(productName)}`,
      `<b>Selected size:</b> ${escapeHtml(size)}`,
      `<b>Price:</b> ${escapeHtml(formatMoney(price))}`,
      `<b>Note:</b> ${escapeHtml(noteValue)}`,
      '',
      '<b>Room preview</b>',
      `<b>Mode:</b> ${escapeHtml(placementMode)}`,
      `<b>Room width:</b> ${escapeHtml(roomWidth)}`,
      `<b>Room height:</b> ${escapeHtml(roomHeight)}`,
      `<b>Room image uploaded:</b> ${escapeHtml(hasRoomImage)}`,
      `<b>AI preview generated:</b> ${escapeHtml(hasGeneratedPreview)}`,
    ].join('\n');

    let telegramResponse;

    if (previewImage) {
      telegramResponse = await sendTelegramPhoto({
        token,
        chatId: adminChatId,
        photoDataUrl: previewImage,
        caption: text,
      });
    } else {
      telegramResponse = await sendTelegramMessage({
        token,
        chatId: adminChatId,
        text,
      });
    }

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramData?.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: telegramData?.description || 'Telegram Bot API request failed',
        }),
      };
    }

    if (previewImage && user?.id) {
      const customerCaption = [
        '<b>Sanat Hali</b>',
        '',
        '<b>Sizning xonadagi preview tayyor.</b>',
        `<b>Mahsulot:</b> ${escapeHtml(productName)}`,
        `<b>O'lcham:</b> ${escapeHtml(size)}`,
        `<b>Narx:</b> ${escapeHtml(formatMoney(price))}`,
      ].join('\n');

      try {
        const customerResponse = await sendTelegramPhoto({
          token,
          chatId: user.id,
          photoDataUrl: previewImage,
          caption: customerCaption,
        });
        const customerData = await customerResponse.json();

        if (!customerResponse.ok || !customerData?.ok) {
          console.warn('Failed to send preview image to customer:', customerData?.description || 'Unknown Telegram error');
        }
      } catch (customerError) {
        console.warn('Failed to send preview image to customer:', customerError);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
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
