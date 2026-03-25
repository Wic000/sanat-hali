export type TelegramUser = {
  id?: number
  username?: string
  first_name?: string
  last_name?: string
}

declare global {
  interface Window {
    Telegram?: any
  }
}

export function getTelegramUser(): TelegramUser | null {
  return window?.Telegram?.WebApp?.initDataUnsafe?.user ?? null
}

export function getTelegramWebApp() {
  return window?.Telegram?.WebApp ?? null
}

export function isAdmin(user: TelegramUser | null) {
  return !!user?.id && [704362699].includes(user.id)
}
