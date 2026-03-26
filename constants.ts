import { Product } from './types';

export const ADMIN_TELEGRAM_IDS = [704362699];

const imagePool = [
  '/images/gilam1.jpg',
  '/images/gilam2.jpg',
  '/images/gilam3.jpg',
  '/images/gilam4.jpg',
  '/images/gilam5.jpg',
  '/images/gilam6.jpg',
  '/images/gilam7.jpg',
  '/images/gilam8.jpg',
];

const galleryFor = (primary: string, startIndex: number) => {
  const rotated = imagePool.slice(startIndex).concat(imagePool.slice(0, startIndex));
  const unique = [primary, ...rotated.filter((image) => image !== primary)];
  return unique.slice(0, 5);
};

const sharedSizes = [
  { label: '200 x 300 cm', multiplier: 1 },
  { label: '250 x 350 cm', multiplier: 1.24 },
  { label: '300 x 400 cm', multiplier: 1.52 },
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Sofiya Classic',
    nameI18n: { uz: 'Sofiya Klassik', ru: 'София Классик', en: 'Sofiya Classic' },
    category: 'Classic',
    basePrice: 3600000,
    images: galleryFor('/images/gilam1.jpg', 0),
    sizes: sharedSizes,
    description: 'Refined classic carpet with warm ivory balance and a salon-grade finish for elegant living rooms.',
    descriptionI18n: {
      uz: 'Issiq ivory balansi va salon darajasidagi finishga ega nafis klassik gilam.',
      ru: 'Изысканный классический ковер с теплым ivory балансом и салонной отделкой.',
      en: 'Refined classic carpet with warm ivory balance and a salon-grade finish for elegant living rooms.',
    },
    specs: ['Classic ornament', 'Soft-touch pile', 'High-density weave', 'Living room ready'],
    specsI18n: {
      uz: ['Klassik ornament', 'Yumshoq tuk', 'Zich to‘qima', 'Mehmonxona uchun'],
      ru: ['Классический орнамент', 'Мягкий ворс', 'Плотное плетение', 'Для гостиной'],
      en: ['Classic ornament', 'Soft-touch pile', 'High-density weave', 'Living room ready'],
    },
    featured: true,
    visible: true,
  },
  {
    id: '2',
    name: 'Modern Grid',
    nameI18n: { uz: 'Modern Grid', ru: 'Модерн Грид', en: 'Modern Grid' },
    category: 'Modern',
    basePrice: 2550000,
    images: galleryFor('/images/gilam2.jpg', 1),
    sizes: [
      { label: '160 x 230 cm', multiplier: 0.82 },
      { label: '200 x 300 cm', multiplier: 1 },
      { label: '250 x 350 cm', multiplier: 1.18 },
    ],
    description: 'Calm modern composition with subtle geometry and clean showroom-friendly contrast.',
    descriptionI18n: {
      uz: 'Nozik geometriyali, showroom uchun toza kontrast beradigan sokin modern model.',
      ru: 'Спокойная современная композиция с деликатной геометрией и чистым контрастом.',
      en: 'Calm modern composition with subtle geometry and clean showroom-friendly contrast.',
    },
    specs: ['Minimal grid', 'Easy-care surface', 'Contemporary palette', 'Studio friendly'],
    specsI18n: {
      uz: ['Minimal grid', 'Oson parvarish', 'Zamonaviy palitra', 'Studio uchun'],
      ru: ['Минимал grid', 'Легкий уход', 'Современная палитра', 'Для студии'],
      en: ['Minimal grid', 'Easy-care surface', 'Contemporary palette', 'Studio friendly'],
    },
    visible: true,
  },
  {
    id: '3',
    name: 'Loop Pattern',
    nameI18n: { uz: 'Loop Pattern', ru: 'Луп Паттерн', en: 'Loop Pattern' },
    category: 'Modern',
    basePrice: 2450000,
    images: galleryFor('/images/gilam3.jpg', 2),
    sizes: [
      { label: '160 x 230 cm', multiplier: 0.8 },
      { label: '200 x 300 cm', multiplier: 1 },
      { label: '300 x 400 cm', multiplier: 1.42 },
    ],
    description: 'Architectural pattern designed for compact lounge zones and creative studios.',
    descriptionI18n: {
      uz: 'Kompakt lounge hududlari va kreativ studiyalar uchun arxitektural naqsh.',
      ru: 'Архитектурный узор для компактных lounge-зон и креативных студий.',
      en: 'Architectural pattern designed for compact lounge zones and creative studios.',
    },
    specs: ['Geometric rhythm', 'Soft grey tone', 'Low visual noise', 'Premium modern feel'],
    specsI18n: {
      uz: ['Geometrik ritm', 'Yumshoq kulrang', 'Tinch ko‘rinish', 'Premium modern'],
      ru: ['Геометрический ритм', 'Мягкий серый тон', 'Спокойный вид', 'Премиум модерн'],
      en: ['Geometric rhythm', 'Soft grey tone', 'Low visual noise', 'Premium modern feel'],
    },
    visible: true,
  },
  {
    id: '4',
    name: 'Marble Light',
    nameI18n: { uz: 'Marble Light', ru: 'Марбл Лайт', en: 'Marble Light' },
    category: 'Abstract',
    basePrice: 2790000,
    images: galleryFor('/images/gilam4.jpg', 3),
    sizes: sharedSizes,
    description: 'Light marble movement with a clean premium surface for polished modern interiors.',
    descriptionI18n: {
      uz: 'Yengil marble harakati va toza premium sirt zamonaviy interyerga mos.',
      ru: 'Легкий marble-эффект и чистая премиальная поверхность для современного интерьера.',
      en: 'Light marble movement with a clean premium surface for polished modern interiors.',
    },
    specs: ['Abstract marble', 'Light palette', 'Balanced texture', 'Modern family room'],
    specsI18n: {
      uz: ['Abstrakt marble', 'Yorug‘ palitra', 'Muvozanatli tekstura', 'Oilaviy xona uchun'],
      ru: ['Абстрактный marble', 'Светлая палитра', 'Сбалансированная текстура', 'Для семейной комнаты'],
      en: ['Abstract marble', 'Light palette', 'Balanced texture', 'Modern family room'],
    },
    visible: true,
  },
  {
    id: '5',
    name: 'Blue Marble',
    nameI18n: { uz: 'Blue Marble', ru: 'Блу Марбл', en: 'Blue Marble' },
    category: 'Abstract',
    basePrice: 2990000,
    images: galleryFor('/images/gilam5.jpg', 4),
    sizes: sharedSizes,
    description: 'Bold marble-inspired statement piece with cooler undertones and stronger depth.',
    descriptionI18n: {
      uz: 'Sovuqroq ohang va chuqurroq ko‘rinishga ega kuchli marble aksent model.',
      ru: 'Выразительный marble-акцент с более холодным оттенком и глубиной.',
      en: 'Bold marble-inspired statement piece with cooler undertones and stronger depth.',
    },
    specs: ['Blue accents', 'Premium finish', 'Statement surface', 'Layered interiors'],
    specsI18n: {
      uz: ['Ko‘k aksent', 'Premium finish', 'Aksent sirt', 'Qatlamli interyer'],
      ru: ['Синие акценты', 'Премиальная отделка', 'Акцентная поверхность', 'Многослойный интерьер'],
      en: ['Blue accents', 'Premium finish', 'Statement surface', 'Layered interiors'],
    },
    visible: true,
  },
  {
    id: '6',
    name: 'Gold Bloom',
    nameI18n: { uz: 'Gold Bloom', ru: 'Голд Блум', en: 'Gold Bloom' },
    category: 'Classic',
    basePrice: 3350000,
    images: galleryFor('/images/gilam6.jpg', 5),
    sizes: sharedSizes,
    description: 'Warm gold detailing creates a formal showroom look without feeling heavy.',
    descriptionI18n: {
      uz: 'Iliq oltin detallar og‘ir bo‘lmagan formal showroom kayfiyatini beradi.',
      ru: 'Теплые золотые детали создают формальный вид шоурума без тяжести.',
      en: 'Warm gold detailing creates a formal showroom look without feeling heavy.',
    },
    specs: ['Gold detailing', 'Elegant contrast', 'Premium weave', 'Formal lounge use'],
    specsI18n: {
      uz: ['Oltin detal', 'Elegant kontrast', 'Premium to‘qima', 'Formal lounge uchun'],
      ru: ['Золотые детали', 'Элегантный контраст', 'Премиальное плетение', 'Для formal lounge'],
      en: ['Gold detailing', 'Elegant contrast', 'Premium weave', 'Formal lounge use'],
    },
    featured: true,
    visible: true,
  },
  {
    id: '7',
    name: 'Persian Soft',
    nameI18n: { uz: 'Persian Soft', ru: 'Персиан Софт', en: 'Persian Soft' },
    category: 'Classic',
    basePrice: 3890000,
    images: galleryFor('/images/gilam7.jpg', 6),
    sizes: [
      { label: '200 x 300 cm', multiplier: 1 },
      { label: '250 x 350 cm', multiplier: 1.28 },
      { label: '300 x 400 cm', multiplier: 1.56 },
    ],
    description: 'Premium Persian-inspired option with softer ornament edges and a calm cream base.',
    descriptionI18n: {
      uz: 'Yumshoq ornament chiziqlari va sokin krem asosli premium Persian uslubi.',
      ru: 'Премиальный Persian-стиль с мягкими линиями орнамента и спокойной кремовой базой.',
      en: 'Premium Persian-inspired option with softer ornament edges and a calm cream base.',
    },
    specs: ['Persian mood', 'Cream palette', 'Border definition', 'Luxury hospitality feel'],
    specsI18n: {
      uz: ['Persian kayfiyati', 'Krem palitra', 'Aniq border', 'Luxury hospitality'],
      ru: ['Persian настроение', 'Кремовая палитра', 'Четкая кайма', 'Luxury hospitality'],
      en: ['Persian mood', 'Cream palette', 'Border definition', 'Luxury hospitality feel'],
    },
    featured: true,
    visible: true,
  },
  {
    id: '8',
    name: 'Abstract Stone',
    nameI18n: { uz: 'Abstract Stone', ru: 'Абстракт Стоун', en: 'Abstract Stone' },
    category: 'Abstract',
    basePrice: 2850000,
    images: galleryFor('/images/gilam8.jpg', 7),
    sizes: sharedSizes,
    description: 'Stone-toned texture with gentle warmth for premium apartments and staged rooms.',
    descriptionI18n: {
      uz: 'Stone ohangidagi tekstura premium kvartira va tayyorlangan xonalar uchun mos.',
      ru: 'Текстура stone-toned с мягким теплом для премиальных квартир и staged-room решений.',
      en: 'Stone-toned texture with gentle warmth for premium apartments and staged rooms.',
    },
    specs: ['Stone texture', 'Soft contrast', 'Showroom adaptable', 'Balanced neutral finish'],
    specsI18n: {
      uz: ['Stone tekstura', 'Yumshoq kontrast', 'Showroomga mos', 'Neytral finish'],
      ru: ['Stone текстура', 'Мягкий контраст', 'Адаптивно для шоурума', 'Нейтральный finish'],
      en: ['Stone texture', 'Soft contrast', 'Showroom adaptable', 'Balanced neutral finish'],
    },
    visible: true,
  },
];

export const SHOWROOM_COPY = {
  metrics: [
    { label: 'Products', value: '8' },
    { label: 'Gallery shots', value: '5 per item' },
    { label: 'Order route', value: 'Telegram bot' },
  ],
};
