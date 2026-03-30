import React, { useMemo, useState } from 'react';
import { Product, ThemeMode } from '../types';

interface AdminDashboardProps {
  products: Product[];
  formatPrice: (value: number) => string;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onBackHome: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  formatPrice,
  theme,
  onToggleTheme,
  onBackHome,
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((product) => product.category)))],
    [products]
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory = category === 'All' || product.category === category;
        const haystack = `${product.name} ${product.category} ${product.description}`.toLowerCase();
        const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase());
        return matchesCategory && matchesQuery;
      }),
    [products, query, category]
  );

  const featuredCount = products.filter((product) => product.featured).length;
  const visibleCount = products.filter((product) => product.visible !== false).length;

  return (
    <div
      className={`ios-liquid-bg min-h-screen ${
        theme === 'dark'
          ? 'bg-[radial-gradient(circle_at_top,_rgba(53,62,86,0.52),_rgba(20,23,31,0.9),_rgba(10,12,18,0.98))] text-stone-100'
          : 'bg-[linear-gradient(180deg,_rgba(247,243,236,0.94)_0%,_rgba(231,226,217,0.92)_58%,_rgba(219,222,228,0.84)_100%)] text-stone-900'
      }`}
    >
      <div className={`ios-grid ${theme === 'dark' ? 'opacity-10' : ''}`} />
      <div className="ios-orb one" />
      <div className="ios-orb two" />

      <div className="mx-auto w-full max-w-[1440px] px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <section
          className={`rounded-[32px] border p-5 shadow-[0_20px_80px_rgba(84,102,140,0.14)] backdrop-blur-2xl ${
            theme === 'dark'
              ? 'border-white/10 bg-[linear-gradient(145deg,_rgba(31,37,52,0.72),_rgba(18,21,29,0.54))]'
              : 'border-white/75 bg-[linear-gradient(145deg,_rgba(255,255,255,0.56),_rgba(239,245,255,0.4))]'
          }`}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className={`text-[11px] uppercase tracking-[0.24em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                Web admin
              </p>
              <h1 className="mt-2 font-display text-4xl">Sanat Hali Admin</h1>
              <p className={`mt-3 max-w-2xl text-sm leading-6 ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>
                Bu panel Telegram ichidan emas, alohida web sahifa sifatida boshqaruvni qulay qilish uchun tayyorlandi.
                Hozirgi mahsulotlar lokal katalogdan o‘qilmoqda.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onToggleTheme}
                className={`rounded-[22px] border px-4 py-3 text-sm font-semibold ${
                  theme === 'dark' ? 'border-white/10 bg-white/5 text-stone-100' : 'border-stone-200 bg-white text-stone-800'
                }`}
              >
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
              <button
                type="button"
                onClick={onBackHome}
                className={`rounded-[22px] px-5 py-3 text-sm font-semibold shadow-[0_18px_30px_rgba(28,25,23,0.18)] ${
                  theme === 'dark'
                    ? 'bg-amber-100 text-stone-900 hover:bg-amber-50'
                    : 'bg-stone-900 text-white hover:bg-stone-800'
                }`}
              >
                Showroomga qaytish
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Jami mahsulot', value: String(products.length) },
              { label: 'Ko‘rinadigan', value: String(visibleCount) },
              { label: 'Featured', value: String(featuredCount) },
              { label: 'Katalog manbasi', value: 'Local public/images' },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-[24px] border p-4 ${
                  theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/55'
                }`}
              >
                <div className={`text-[11px] uppercase tracking-[0.22em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                  {item.label}
                </div>
                <div className="mt-2 text-2xl font-semibold">{item.value}</div>
              </div>
            ))}
          </div>
        </section>

        <section
          className={`mt-4 rounded-[32px] border p-5 shadow-[0_20px_80px_rgba(84,102,140,0.14)] backdrop-blur-2xl ${
            theme === 'dark'
              ? 'border-white/10 bg-[linear-gradient(145deg,_rgba(31,37,52,0.72),_rgba(18,21,29,0.54))]'
              : 'border-white/75 bg-[linear-gradient(145deg,_rgba(255,255,255,0.56),_rgba(239,245,255,0.4))]'
          }`}
        >
          <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr]">
            <label className={`rounded-[24px] border px-4 py-4 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/55'}`}>
              <div className={`text-[11px] uppercase tracking-[0.22em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                Qidiruv
              </div>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Nomi, kategoriya yoki tavsif..."
                className={`mt-2 w-full bg-transparent text-lg outline-none ${theme === 'dark' ? 'text-stone-100 placeholder:text-stone-500' : 'text-stone-900 placeholder:text-stone-400'}`}
              />
            </label>

            <label className={`rounded-[24px] border px-4 py-4 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/55'}`}>
              <div className={`text-[11px] uppercase tracking-[0.22em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                Kategoriya
              </div>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className={`mt-2 w-full bg-transparent text-lg outline-none ${theme === 'dark' ? 'text-stone-100' : 'text-stone-900'}`}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className={`rounded-[32px] border p-4 shadow-[0_20px_60px_rgba(84,102,140,0.12)] backdrop-blur-2xl ${
                theme === 'dark'
                  ? 'border-white/10 bg-[linear-gradient(145deg,_rgba(31,37,52,0.72),_rgba(18,21,29,0.54))]'
                  : 'border-white/75 bg-[linear-gradient(145deg,_rgba(255,255,255,0.56),_rgba(239,245,255,0.4))]'
              }`}
            >
              <div className="aspect-[4/3] overflow-hidden rounded-[24px]">
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
              </div>

              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-3xl leading-none">{product.name}</h2>
                  <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>{product.category}</p>
                </div>
                {product.featured && (
                  <div className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                    theme === 'dark' ? 'bg-amber-100 text-stone-900' : 'bg-stone-900 text-white'
                  }`}>
                    Featured
                  </div>
                )}
              </div>

              <div className={`mt-4 rounded-[24px] border p-4 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/55'}`}>
                <div className={`text-[11px] uppercase tracking-[0.22em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                  Bazaviy narx
                </div>
                <div className="mt-2 text-2xl font-semibold">{formatPrice(product.basePrice)}</div>
              </div>

              <p className={`mt-4 text-sm leading-6 ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>
                {product.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <span
                    key={size.label}
                    className={`rounded-full px-3 py-2 text-xs ${
                      theme === 'dark' ? 'bg-white/5 text-stone-200' : 'bg-white/70 text-stone-700'
                    }`}
                  >
                    {size.label}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {product.specs.slice(0, 4).map((spec) => (
                  <span
                    key={spec}
                    className={`rounded-full border px-3 py-2 text-xs ${
                      theme === 'dark' ? 'border-white/10 text-stone-300' : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
