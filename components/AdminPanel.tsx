import React from 'react';
import { ThemeMode } from '../types';

interface AdminPanelProps {
  telegramId?: number;
  summary: Array<{ label: string; value: string }>;
  title: string;
  hint: string;
  adminOnlyLabel: string;
  telegramUserLabel: string;
  theme: ThemeMode;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ telegramId, summary, title, hint, adminOnlyLabel, telegramUserLabel, theme }) => (
  <section className={`mb-4 rounded-[28px] border p-5 shadow-[0_20px_70px_rgba(35,30,26,0.22)] ${
    theme === 'dark'
      ? 'border-white/10 bg-[linear-gradient(145deg,_rgba(16,15,14,0.96),_rgba(37,34,30,0.94))] text-white'
      : 'border-stone-900/8 bg-[linear-gradient(145deg,_rgba(35,30,26,0.96),_rgba(63,51,40,0.94))] text-white'
  }`}>
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200/70">
          {adminOnlyLabel}
        </p>
        <h2 className="mt-2 font-display text-3xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-stone-200/80">{hint}</p>
      </div>
      <div className="flex flex-col gap-3 md:items-end">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-200/90">
          {telegramUserLabel}: {telegramId || 'Unknown'}
        </div>
        <a
          href="/admin"
          className="rounded-2xl bg-amber-100 px-4 py-3 text-sm font-semibold text-stone-900 transition hover:bg-amber-50"
        >
          Web adminni ochish
        </a>
      </div>
    </div>

    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {summary.map((item) => (
        <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-[11px] uppercase tracking-[0.22em] text-stone-300/70">{item.label}</div>
          <div className="mt-2 text-lg font-semibold text-white">{item.value}</div>
        </div>
      ))}
    </div>
  </section>
);

export default AdminPanel;
