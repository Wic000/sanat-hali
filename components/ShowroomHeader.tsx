import React from 'react';
import { AppLang, TelegramUser, ThemeMode } from '../types';

interface ShowroomHeaderProps {
  telegramUser: TelegramUser | null;
  isAdmin: boolean;
  showAdminPanel: boolean;
  onToggleAdmin: () => void;
  lang: AppLang;
  theme: ThemeMode;
  languageLabel: string;
  themeLabel: string;
  customerLabel: string;
  subtitle: string;
  adminOpenLabel: string;
  adminCloseLabel: string;
  userMissingLabel: string;
  usernameMissingLabel: string;
  onToggleTheme: () => void;
  onChangeLang: (lang: AppLang) => void;
}

const getAvatarLetter = (telegramUser: TelegramUser | null) => {
  const source =
    telegramUser?.first_name ||
    telegramUser?.last_name ||
    telegramUser?.username ||
    'S';

  return source.charAt(0).toUpperCase();
};

const getLanguageFlag = (lang: AppLang) => {
  if (lang === 'ru') return '🇷🇺';
  if (lang === 'en') return '🇺🇸';
  return '🇺🇿';
};

const ShowroomHeader: React.FC<ShowroomHeaderProps> = ({
  telegramUser,
  isAdmin,
  showAdminPanel,
  onToggleAdmin,
  lang,
  theme,
  languageLabel,
  themeLabel,
  customerLabel,
  subtitle,
  adminOpenLabel,
  adminCloseLabel,
  userMissingLabel,
  usernameMissingLabel,
  onToggleTheme,
  onChangeLang,
}) => {
  const displayName = telegramUser?.first_name || telegramUser?.last_name || userMissingLabel;
  const displayUsername = telegramUser?.username ? `@${telegramUser.username}` : usernameMissingLabel;

  return (
  <header className={`mb-3 rounded-[28px] border px-3 py-3 shadow-[0_20px_80px_rgba(73,88,129,0.14)] backdrop-blur-2xl sm:mb-4 sm:px-5 sm:py-4 ${
    theme === 'dark'
      ? 'border-white/10 bg-[linear-gradient(135deg,_rgba(30,35,48,0.74),_rgba(18,21,29,0.52))]'
      : 'border-white/75 bg-[linear-gradient(135deg,_rgba(255,255,255,0.56),_rgba(240,246,255,0.42))]'
  }`}>
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <button
          type="button"
          onClick={() => {
            window.location.href = '/';
          }}
          className={`font-display text-left text-[2.1rem] leading-none transition hover:opacity-80 sm:text-4xl ${theme === 'dark' ? 'text-stone-100' : 'text-stone-900'}`}
        >
          Sanat Hali
        </button>
        <p className={`mt-1 max-w-2xl text-xs sm:mt-2 sm:text-base ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>{subtitle}</p>
      </div>

      <div className="grid grid-cols-[auto_auto_auto] gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
        <div className={`flex min-w-0 items-center gap-2 rounded-2xl border px-2 py-2 shadow-sm ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/48'}`}>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border text-sm font-bold ${
            theme === 'dark'
              ? 'border-white/10 bg-stone-900 text-stone-100'
              : 'border-stone-200 bg-white text-stone-800'
          }`}>
            {telegramUser?.photo_url ? (
              <img
                src={telegramUser.photo_url}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              getAvatarLetter(telegramUser)
            )}
          </div>
          <div className="hidden min-w-0 sm:block">
            <div className={`truncate text-sm font-semibold ${theme === 'dark' ? 'text-stone-100' : 'text-stone-800'}`}>
              {displayName}
            </div>
            <div className={`truncate text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
              {displayUsername}
            </div>
          </div>
        </div>

        <div className={`flex items-center justify-end gap-2 rounded-2xl border px-2 py-2 shadow-sm sm:justify-start sm:px-3 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/48'}`}>
          <span className={`hidden text-[11px] font-semibold uppercase tracking-[0.22em] sm:inline ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>{languageLabel}</span>
          <select
            value={lang}
            onChange={(event) => onChangeLang(event.target.value as AppLang)}
            className={`min-w-[62px] rounded-xl border px-2 py-1 text-sm outline-none sm:min-w-0 ${theme === 'dark' ? 'border-white/10 bg-stone-900 text-stone-100' : 'border-stone-200 bg-white text-stone-800'}`}
          >
            <option value="uz">{getLanguageFlag('uz')}</option>
            <option value="ru">{getLanguageFlag('ru')}</option>
            <option value="en">{getLanguageFlag('en')}</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <button
            type="button"
            onClick={onToggleTheme}
            className={`rounded-2xl border px-3 py-2.5 text-sm font-semibold transition sm:px-4 sm:py-3 ${
              theme === 'dark'
                ? 'border-white/10 bg-white/5 text-stone-100 hover:bg-white/10'
                : 'border-white/80 bg-[rgba(255,255,255,0.5)] text-stone-800 hover:bg-[rgba(255,255,255,0.64)]'
            }`}
          >
            <span className="sm:hidden">{theme === 'light' ? '☀' : '☾'}</span>
            <span className="hidden sm:inline">{themeLabel}</span>
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={onToggleAdmin}
              className={`rounded-2xl border px-3 py-2.5 text-sm font-semibold shadow-[0_12px_24px_rgba(28,25,23,0.2)] transition sm:px-4 sm:py-3 ${
                theme === 'dark'
                  ? 'border-amber-200/20 bg-amber-100 text-stone-900 hover:bg-amber-50'
                  : 'border-white/80 bg-[rgba(255,242,210,0.86)] text-stone-900 hover:bg-[rgba(255,247,222,0.96)]'
              }`}
            >
              <span className="sm:hidden">Admin</span>
              <span className="hidden sm:inline">{showAdminPanel ? adminCloseLabel : adminOpenLabel}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  </header>
  );
};

export default ShowroomHeader;
