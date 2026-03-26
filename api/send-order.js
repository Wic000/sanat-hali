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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = process.env.ORDER_BOT_TOKEN;
    const adminChatId = process.env.ADMIN_CHAT_ID;

    if (!token || !adminChatId) {
      return res.status(500).json({ error: 'Missing ORDER_BOT_TOKEN or ADMIN_CHAT_ID' });
    }

    const { user, phone, productName, size, price, note, room } = req.body || {};

    if (!productName || !size || !price) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const firstName = user?.first_name || 'not provided';
    const lastName = user?.last_name || 'not provided';
    const username = user?.username ? `@${user.username}` : 'not provided';
    const telegramId = user?.id ? String(user.id) : 'not provided';
    const phoneValue = phone || user?.phone_number || 'not provided';
    const noteValue = note || 'not provided';
    const placementMode =
      room?.placementMode === 'coverage' ? 'full room coverage' : 'center placement';
    const roomWidth = room?.width || 'not provided';
    const roomHeight = room?.height || 'not provided';
    const hasRoomImage = room?.hasRoomImage ? 'yes' : 'no';
    const hasGeneratedPreview = room?.hasGeneratedPreview ? 'yes' : 'no';

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

    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: adminChatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramData?.ok) {
      return res.status(500).json({
        error: telegramData?.description || 'Telegram Bot API request failed',
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
}
