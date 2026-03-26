import React from 'react';
import { ThemeMode } from '../types';

const HeroBanner: React.FC<{
  badge: string;
  metrics: Array<{ label: string; value: string }>;
  title: string;
  description: string;
  theme: ThemeMode;
}> = ({ badge, metrics, title, description, theme }) => (
  <section className={`mt-6 rounded-[28px] border p-4 shadow-[0_18px_50px_rgba(118,88,52,0.1)] backdrop-blur-xl sm:p-5 ${
    theme === 'dark'
      ? 'border-white/10 bg-[linear-gradient(135deg,_rgba(24,21,18,0.92),_rgba(40,35,31,0.86))]'
      : 'border-white/60 bg-[linear-gradient(135deg,_rgba(255,252,246,0.92),_rgba(247,239,229,0.8))]'
  }`}>
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
      <div>
        <div className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${
          theme === 'dark'
            ? 'border-amber-200/20 bg-white/5 text-amber-100/80'
            : 'border-amber-200/80 bg-white/70 text-amber-900/80'
        }`}>
          {badge}
        </div>
        <h2 className={`mt-3 max-w-3xl font-display text-3xl leading-[0.98] sm:text-4xl ${theme === 'dark' ? 'text-stone-100' : 'text-stone-900'}`}>{title}</h2>
        <p className={`mt-3 max-w-2xl text-sm leading-6 ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>{description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className={`rounded-[20px] border p-3 shadow-sm ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/75'}`}>
            <div className={`text-[11px] uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>{metric.label}</div>
            <div className={`mt-2 text-xl font-semibold ${theme === 'dark' ? 'text-stone-100' : 'text-stone-900'}`}>{metric.value}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HeroBanner;
