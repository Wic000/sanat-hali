import type { Rug } from './types'

export const rugs: Rug[] = [
  {
    id: 'sof-bloom',
    title: 'Sanat Hali Soft Bloom',
    category: 'Classic',
    code: 'SH-201',
    price: 290000,
    dimensions: ['200 × 300', '250 × 350', '300 × 400'],
    description: 'Yumshoq premium gilam. Mehmonxona va yotoqxona uchun mos, nafis oltin naqshlar bilan ishlangan.',
    features: ['Yengil ranglar', 'Premium to‘qima', 'Issiq va nafis ko‘rinish'],
    images: ['/rugs/rug1.svg', '/rugs/rug2.svg', '/rugs/rug3.svg', '/rugs/rug4.svg', '/rugs/rug5.svg'],
  },
  {
    id: 'isfahan',
    title: 'Classic Isfahan 193',
    category: 'Classic',
    code: 'M1152-A',
    price: 3500000,
    dimensions: ['250 × 350', '300 × 400'],
    description: 'Isfahan yo‘nalishidagi klassik model. Markaziy medalyon va boy ramka bezaklari bilan premium kolleksiya.',
    features: ['Qalin to‘qima', 'Markaziy medalyon', 'Klassik premium uslub'],
    images: ['/rugs/rug2.svg', '/rugs/rug1.svg', '/rugs/rug3.svg', '/rugs/rug5.svg', '/rugs/rug4.svg'],
  },
  {
    id: 'wave',
    title: 'Modern Wave Line',
    category: 'Modern',
    code: 'MV-508',
    price: 1980000,
    dimensions: ['200 × 300', '250 × 350'],
    description: 'Minimal modern interyerlar uchun. Chiziqli ritm va osoyishta rang kombinatsiyasi bilan.',
    features: ['Modern uslub', 'Sokin ranglar', 'Oson moslashadi'],
    images: ['/rugs/rug3.svg', '/rugs/rug4.svg', '/rugs/rug5.svg', '/rugs/rug1.svg', '/rugs/rug2.svg'],
  },
]
