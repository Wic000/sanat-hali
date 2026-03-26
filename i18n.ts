import { AppLang, Product, ThemeMode } from './types';

export const LANG_LABELS: Record<AppLang, string> = {
  uz: 'UZ',
  ru: 'RU',
  en: 'EN',
};

export const CATEGORY_TRANSLATIONS: Record<string, Record<AppLang, string>> = {
  All: { uz: 'Barchasi', ru: 'Все', en: 'All' },
  Classic: { uz: 'Klassik', ru: 'Классика', en: 'Classic' },
  Modern: { uz: 'Modern', ru: 'Модерн', en: 'Modern' },
  Abstract: { uz: 'Abstrakt', ru: 'Абстракт', en: 'Abstract' },
};

export const translations = {
  appBadge: { uz: 'Telegram Mini App', ru: 'Telegram Mini App', en: 'Telegram Mini App' },
  premiumShowroom: {
    uz: 'Premium gilam showroom, Telegram uchun moslashtirilgan.',
    ru: 'Премиальный шоурум ковров, адаптированный для Telegram.',
    en: 'Premium carpet showroom tailored for Telegram.',
  },
  customer: { uz: 'Mijoz', ru: 'Клиент', en: 'Customer' },
  userMissing: {
    uz: 'Telegram foydalanuvchisi topilmadi',
    ru: 'Пользователь Telegram не найден',
    en: 'Telegram user not detected',
  },
  usernameMissing: {
    uz: 'username berilmagan',
    ru: 'username не указан',
    en: 'username not provided',
  },
  adminPanel: { uz: 'Admin panel', ru: 'Админ панель', en: 'Admin panel' },
  closeAdminPanel: { uz: 'Admin panelni yopish', ru: 'Закрыть админ панель', en: 'Close admin panel' },
  adminOnly: { uz: 'Faqat admin', ru: 'Только админ', en: 'Admin only' },
  adminHeading: { uz: 'Showroom nazorati', ru: 'Управление шоурумом', en: 'Showroom control' },
  adminHint: {
    uz: "Bu blok faqat 704362699 Telegram ID uchun korinadi. Boshqalar uni ko'rmaydi.",
    ru: 'Этот блок виден только для Telegram ID 704362699. Остальные его не увидят.',
    en: 'This block is visible only for Telegram ID 704362699. Other users never see it.',
  },
  telegramUser: { uz: 'Telegram user', ru: 'Telegram user', en: 'Telegram user' },
  products: { uz: 'Mahsulotlar', ru: 'Товары', en: 'Products' },
  featuredCount: { uz: 'Featured', ru: 'Featured', en: 'Featured' },
  dataSource: { uz: 'Manba', ru: 'Источник', en: 'Data source' },
  catalogSource: { uz: 'Statik showroom katalogi', ru: 'Статический каталог шоурума', en: 'Static showroom catalog' },
  heroBadge: { uz: 'Tanlangan premium kolleksiya', ru: 'Выбранная премиум коллекция', en: 'Curated premium collection' },
  heroTitle: {
    uz: 'Telegram ichidagi premium panel showroom.',
    ru: 'Премиальный панельный шоурум прямо внутри Telegram.',
    en: 'Premium panel showroom inside Telegram.',
  },
  heroDescription: {
    uz: "Gilamni tanlang, o'lchamni almashtiring, xonada ko'ring va buyurtmani admin Telegramiga yuboring.",
    ru: 'Выберите ковер, измените размер, посмотрите в комнате и отправьте заказ администратору в Telegram.',
    en: 'Choose a carpet, switch sizes, preview it in a room, and send the order directly to the admin on Telegram.',
  },
  galleryShots: { uz: 'Gallery rasmlar', ru: 'Фото галереи', en: 'Gallery shots' },
  orderRoute: { uz: 'Buyurtma yo‘li', ru: 'Канал заказа', en: 'Order route' },
  telegramBot: { uz: 'Telegram bot', ru: 'Telegram bot', en: 'Telegram bot' },
  selectedCarpet: { uz: 'Tanlangan gilam', ru: 'Выбранный ковер', en: 'Selected carpet' },
  featured: { uz: 'Featured', ru: 'Featured', en: 'Featured' },
  price: { uz: 'Narx', ru: 'Цена', en: 'Price' },
  sizes: { uz: "O'lchamlar", ru: 'Размеры', en: 'Sizes' },
  description: { uz: 'Tavsif', ru: 'Описание', en: 'Description' },
  specs: { uz: 'Xususiyatlar', ru: 'Характеристики', en: 'Specs' },
  note: { uz: 'Izoh', ru: 'Комментарий', en: 'Note' },
  notePlaceholder: {
    uz: "Qo'shimcha eslatma, rang, yetkazib berish va hokazo.",
    ru: 'Дополнительный комментарий, цвет, доставка и т.д.',
    en: 'Extra note, color, delivery details, and so on.',
  },
  phone: { uz: 'Telefon', ru: 'Телефон', en: 'Phone' },
  orderSending: { uz: 'Buyurtma yuborilmoqda...', ru: 'Отправка заказа...', en: 'Sending order...' },
  orderNow: { uz: 'Buyurtma berish', ru: 'Оформить заказ', en: 'Place order' },
  roomPreview: { uz: 'Xona preview', ru: 'Превью комнаты', en: 'Room preview' },
  aiPreviewDemo: { uz: 'AI preview demo', ru: 'AI preview demo', en: 'AI preview demo' },
  demoReady: { uz: 'Demo tayyor', ru: 'Демо готово', en: 'Demo ready' },
  uploadRoomCta: { uz: 'Xona rasmini yuklash', ru: 'Загрузить фото комнаты', en: 'Upload room photo' },
  roomUploadHint: {
    uz: "Tanlangan gilamni interyerga mos ko'rish uchun xona rasmini yuklang.",
    ru: 'Загрузите фото комнаты, чтобы увидеть ковер в интерьере.',
    en: 'Upload a room photo to preview the selected carpet in the interior.',
  },
  centerPlacement: { uz: 'Markaziy joylashuv', ru: 'Центральное размещение', en: 'Center placement' },
  centerPlacementHint: {
    uz: 'Divan yoki stol ostidagi fokusli joylashuv.',
    ru: 'Фокусное размещение под кофейным столиком или группой мебели.',
    en: 'Focused placement under a coffee table or seating group.',
  },
  fullCoverage: { uz: 'To‘liq qoplash', ru: 'Полное покрытие', en: 'Full room coverage' },
  fullCoverageHint: {
    uz: 'Xonani to‘liq qoplaydigan demo ko‘rinish.',
    ru: 'Демо режим полного покрытия комнаты.',
    en: 'Wall-to-wall style coverage for full room simulations.',
  },
  roomWidth: { uz: 'Xona eni', ru: 'Ширина комнаты', en: 'Room width' },
  roomHeight: { uz: 'Xona bo‘yi', ru: 'Длина комнаты', en: 'Room height' },
  applyPreview: { uz: 'Preview qo‘llash', ru: 'Применить превью', en: 'Apply preview' },
  aiBlock: { uz: 'AI preview bloki', ru: 'Блок AI preview', en: 'AI preview block' },
  aiBlockHint: {
    uz: 'Demo UI hozir ishlaydi. Keyin shu state ichiga haqiqiy AI API ulanadi.',
    ru: 'Сейчас работает демо UI. Позже в это состояние можно подключить реальный AI API.',
    en: 'The demo UI is active now. A real AI API can plug into this same state later.',
  },
  previewReady: { uz: 'Zoom preview', ru: 'Zoom preview', en: 'Zoom preview' },
  collection: { uz: 'Kolleksiya', ru: 'Коллекция', en: 'Collection' },
  supportingGallery: { uz: "Qo'shimcha gallery", ru: 'Дополнительная галерея', en: 'Supporting gallery' },
  models: { uz: 'model', ru: 'моделей', en: 'models' },
  light: { uz: 'Kun', ru: 'День', en: 'Light' },
  dark: { uz: 'Tun', ru: 'Ночь', en: 'Dark' },
  theme: { uz: 'Tema', ru: 'Тема', en: 'Theme' },
  language: { uz: 'Til', ru: 'Язык', en: 'Language' },
  successOrder: {
    uz: 'Buyurtma yuborildi. Administrator tez orada Telegram orqali boglanadi.',
    ru: 'Заказ отправлен. Администратор скоро свяжется с вами в Telegram.',
    en: 'Order sent. The admin will contact you soon on Telegram.',
  },
  orderError: {
    uz: 'Buyurtmani yuborishda xatolik yuz berdi.',
    ru: 'Произошла ошибка при отправке заказа.',
    en: 'An error occurred while sending the order.',
  },
};

export const t = (lang: AppLang, key: keyof typeof translations) => translations[key][lang];

export const translateCategory = (category: string, lang: AppLang) =>
  CATEGORY_TRANSLATIONS[category]?.[lang] || category;

export const localizeProduct = (product: Product, lang: AppLang): Product => ({
  ...product,
  name: product.nameI18n?.[lang] || product.name,
  description: product.descriptionI18n?.[lang] || product.description,
  specs: product.specsI18n?.[lang] || product.specs,
  category: translateCategory(product.category, lang),
});

export const detectInitialLang = (languageCode?: string): AppLang => {
  if (languageCode?.startsWith('ru')) return 'ru';
  if (languageCode?.startsWith('en')) return 'en';
  return 'uz';
};

export const toggleTheme = (theme: ThemeMode): ThemeMode => (theme === 'light' ? 'dark' : 'light');
