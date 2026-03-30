import React from 'react';
import { Product, ThemeMode } from '../types';

interface ProductRailProps {
  products: Product[];
  selectedProductId: string | null;
  formatPrice: (value: number) => string;
  onSelect: (product: Product) => void;
  collectionLabel: string;
  title: string;
  modelsLabel: string;
  premiumLabel: string;
  theme: ThemeMode;
}

const ProductRail: React.FC<ProductRailProps> = ({ products, selectedProductId, formatPrice, onSelect, collectionLabel, title, modelsLabel, premiumLabel, theme }) => (
  <section className={`mt-6 rounded-[32px] border p-4 shadow-[0_20px_80px_rgba(84,102,140,0.14)] backdrop-blur-2xl sm:p-5 ${
    theme === 'dark'
      ? 'border-white/10 bg-[linear-gradient(145deg,_rgba(31,37,52,0.72),_rgba(18,21,29,0.54))]'
      : 'border-white/75 bg-[linear-gradient(145deg,_rgba(255,255,255,0.56),_rgba(239,245,255,0.4))]'
  }`}>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className={`text-[11px] uppercase tracking-[0.24em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>{collectionLabel}</p>
        <h2 className={`mt-2 font-display text-2xl sm:text-3xl ${theme === 'dark' ? 'text-stone-100' : 'text-stone-900'}`}>{title}</h2>
      </div>
      <div className={`text-sm ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>{products.length} {modelsLabel}</div>
    </div>

    <div className="mt-4 grid grid-cols-4 gap-2 sm:hidden">
      {products.map((product) => {
        const active = product.id === selectedProductId;

        return (
          <button
            key={product.id}
            type="button"
            onClick={() => onSelect(product)}
            className={`overflow-hidden rounded-[18px] border text-left transition ${
              active
                ? theme === 'dark'
                  ? 'border-amber-100 bg-amber-100/10 shadow-[0_12px_24px_rgba(28,25,23,0.16)]'
                  : 'border-stone-900 bg-stone-900/5 shadow-[0_12px_24px_rgba(28,25,23,0.12)]'
                : theme === 'dark'
                  ? 'border-white/10 bg-white/5'
                  : 'border-white/80 bg-white/38'
            }`}
          >
            <div className="relative aspect-square overflow-hidden">
              <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
              <div className={`absolute inset-x-0 bottom-0 px-2 py-1 text-[10px] font-semibold backdrop-blur-sm ${
                active
                  ? theme === 'dark'
                    ? 'bg-amber-100/85 text-stone-900'
                    : 'bg-stone-900/85 text-white'
                  : 'bg-black/45 text-white'
              }`}>
                <span className="line-clamp-2">{product.name}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>

    <div className="mt-5 hidden gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => {
        const productPrice = Math.round(product.basePrice * product.sizes[0].multiplier);
        const active = product.id === selectedProductId;

        return (
          <button
            key={product.id}
            type="button"
            onClick={() => onSelect(product)}
            className={`overflow-hidden rounded-[26px] border text-left transition ${
              active
                ? theme === 'dark'
                  ? 'border-amber-100 bg-amber-100 text-stone-900 shadow-[0_18px_40px_rgba(28,25,23,0.18)]'
                  : 'border-stone-900 bg-stone-900 text-white shadow-[0_18px_40px_rgba(28,25,23,0.18)]'
                : theme === 'dark'
                  ? 'border-white/10 bg-white/5 text-stone-100 shadow-sm hover:-translate-y-1 hover:border-white/20'
                  : 'border-white/80 bg-white/42 text-stone-900 shadow-sm hover:-translate-y-1 hover:border-white hover:bg-white/60'
            }`}
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-2xl">{product.name}</h3>
                {product.featured && (
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                      active
                        ? theme === 'dark'
                          ? 'bg-stone-900/10 text-stone-900'
                          : 'bg-white/10 text-white'
                        : theme === 'dark'
                          ? 'bg-amber-100 text-stone-900'
                          : 'bg-amber-50 text-amber-900'
                    }`}
                  >
                    {premiumLabel}
                  </span>
                )}
              </div>
              <p className={`mt-2 text-sm leading-6 ${
                active
                  ? theme === 'dark'
                    ? 'text-stone-800/70'
                    : 'text-white/70'
                  : theme === 'dark'
                    ? 'text-stone-400'
                    : 'text-stone-500'
              }`}>
                {product.description}
              </p>
              <div className={`mt-4 text-sm font-semibold ${active ? (theme === 'dark' ? 'text-stone-900' : 'text-white') : theme === 'dark' ? 'text-stone-100' : 'text-stone-800'}`}>
                {formatPrice(productPrice)}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  </section>
);

export default ProductRail;
