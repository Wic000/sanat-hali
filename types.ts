export interface ProductSize {
  label: string;
  multiplier: number;
}

export type AppLang = 'uz' | 'ru' | 'en';
export type ThemeMode = 'light' | 'dark';

export interface LocalizedText {
  uz: string;
  ru: string;
  en: string;
}

export interface LocalizedSpecs {
  uz: string[];
  ru: string[];
  en: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  images: string[];
  sizes: ProductSize[];
  description: string;
  specs: string[];
  nameI18n?: LocalizedText;
  descriptionI18n?: LocalizedText;
  specsI18n?: LocalizedSpecs;
  featured?: boolean;
  visible?: boolean;
}

export interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  language_code?: string;
}

export type RoomPlacementMode = 'center' | 'coverage';

export interface RoomDimensions {
  width: string;
  height: string;
}

export interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  colorScheme?: ThemeMode;
  initDataUnsafe: {
    user?: TelegramUser;
  };
  HapticFeedback?: {
    notificationOccurred?: (type: 'error' | 'success' | 'warning') => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}
