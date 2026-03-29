# Sanat Hali Telegram Mini App

Premium carpet showroom built with Vite + React + TailwindCSS for Telegram Mini App.

## Asosiy tuzilma

- `App.tsx` - asosiy showroom state va Telegram integration
- `components/` - UI panellar
- `constants.ts` - mahsulotlar katalogi
- `i18n.ts` - `uz`, `ru`, `en` tarjimalari
- `api/send-order.js` - buyurtmani Telegram bot orqali adminga yuboradi
- `styles.css` - Tailwind entry va global stillar

## Kerakli env

`.env` ichiga:

```env
ORDER_BOT_TOKEN=
ADMIN_CHAT_ID=704362699
OPENAI_API_KEY=
OPENAI_ROOM_PREVIEW_MODEL=gpt-image-1
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

`VITE_SUPABASE_URL` va `VITE_SUPABASE_ANON_KEY` hozir majburiy emas.

## Lokal ishga tushirish

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Vercel deploy

1. Node versiyani `20.x` qiling
2. Environment Variables ga `ORDER_BOT_TOKEN`, `ADMIN_CHAT_ID`, `OPENAI_API_KEY`, `OPENAI_ROOM_PREVIEW_MODEL` ni kiriting
3. Deploy qiling

## Hozir loyihada nima tayyor

- Telegram Mini App user aniqlash
- Admin faqat `704362699` uchun
- 3 til: `uz`, `ru`, `en`
- 2 tema: `light`, `dark`
- Telegram `colorScheme` bo'yicha initial theme
- Mobile-first premium showroom layout
- OpenAI orqali room preview generatsiya
- Backend orqali Telegram order yuborish
