export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const token = process.env.ORDER_BOT_TOKEN
    const chatId = process.env.ADMIN_CHAT_ID

    if (!token || !chatId) {
      return res.status(500).json({ error: 'Missing ORDER_BOT_TOKEN or ADMIN_CHAT_ID' })
    }

    const { user, productName, price, size, note } = req.body || {}

    const text = [
      '🛒 Yangi buyurtma',
      '',
      `👤 Ism: ${(user?.first_name || '')}${user?.last_name ? ` ${user.last_name}` : ''}`.trim() || 'yo‘q',
      `🔗 Username: ${user?.username ? '@' + user.username : 'yo‘q'}`,
      `🆔 ID: ${user?.id || 'yo‘q'}`,
      productName ? `📦 Mahsulot: ${productName}` : '',
      size ? `📏 O'lcham: ${size}` : '',
      price ? `💰 Narx: ${price}` : '',
      note ? `📝 Izoh: ${note}` : '',
    ].filter(Boolean).join('
')

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })

    const tgData = await tgRes.json()
    if (!tgData.ok) {
      return res.status(500).json({ error: tgData.description || 'Telegram send failed' })
    }

    return res.status(200).json({ ok: true })
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Server error' })
  }
}
