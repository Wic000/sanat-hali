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
  appBadge: string;
  subtitle: string;
  adminOpenLabel: string;
  adminCloseLabel: string;
  userMissingLabel: string;
  usernameMissingLabel: string;
  onToggleTheme: () => void;
  onChangeLang: (lang: AppLang) => void;
}

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
  appBadge,
  subtitle,
  adminOpenLabel,
  adminCloseLabel,
  userMissingLabel,
  usernameMissingLabel,
  onToggleTheme,
  onChangeLang,
}) => (
  <header className={`mb-4 rounded-[28px] border px-4 py-4 shadow-[0_18px_60px_rgba(90,65,40,0.12)] backdrop-blur-xl sm:px-5 ${
    theme === 'dark'
      ? 'border-white/10 bg-[rgba(28,24,21,0.82)]'
      : 'border-white/60 bg-[rgba(255,252,247,0.7)]'
  }`}>
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <div className={`mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] ${
          theme === 'dark'
            ? 'border-amber-200/20 bg-white/5 text-amber-100/80'
            : 'border-amber-200/70 bg-white/60 text-amber-900/70'
        }`}>
          {appBadge}
        </div>
        <h1 className={`font-display text-3xl leading-none sm:text-4xl ${theme === 'dark' ? 'text-stone-100' : 'text-stone-900'}`}>Sanat Hali</h1>
        <p className={`mt-2 max-w-2xl text-sm sm:text-base ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>{subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className={`rounded-2xl border px-3 py-2 shadow-sm ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/65'}`}>
          <div className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
            {customerLabel}
          </div>
          <div className={`mt-1 text-sm font-semibold ${theme === 'dark' ? 'text-stone-100' : 'text-stone-800'}`}>
            {telegramUser?.first_name || userMissingLabel}
          </div>
          <div className={`text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
            {telegramUser?.username ? `@${telegramUser.username}` : usernameMissingLabel}
          </div>
        </div>

        <div className={`flex items-center gap-2 rounded-2xl border px-3 py-2 shadow-sm ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/65'}`}>
          <span className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>{languageLabel}</span>
          <select
            value={lang}
            onChange={(event) => onChangeLang(event.target.value as AppLang)}
            className={`rounded-xl border px-2 py-1 text-sm outline-none ${theme === 'dark' ? 'border-white/10 bg-stone-900 text-stone-100' : 'border-stone-200 bg-white text-stone-800'}`}
          >
            <option value="uz">UZ</option>
            <option value="ru">RU</option>
            <option value="en">EN</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
            theme === 'dark'
              ? 'border-white/10 bg-white/5 text-stone-100 hover:bg-white/10'
              : 'border-stone-900/10 bg-stone-900 text-white hover:bg-stone-800'
          }`}
        >
          {themeLabel}
        </button>

        {isAdmin && (
          <button
            type="button"
            onClick={onToggleAdmin}
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold shadow-[0_12px_24px_rgba(28,25,23,0.2)] transition ${
              theme === 'dark'
                ? 'border-amber-200/20 bg-amber-100 text-stone-900 hover:bg-amber-50'
                : 'border-stone-900/10 bg-stone-900 text-white hover:bg-stone-800'
            }`}
          >
            {showAdminPanel ? adminCloseLabel : adminOpenLabel}
          </button>
        )}
      </div>
    </div>
  </header>
);

export default ShowroomHeader;
