import React from 'react';
import { Product, ThemeMode } from '../types';

interface ProductInfoPanelProps {
  product: Product;
  selectedSizeLabel: string;
  selectedPriceLabel: string;
  note: string;
  isSubmitting: boolean;
  orderMessage: string;
  orderStatus: 'idle' | 'success' | 'error';
  onSelectSize: (sizeLabel: string) => void;
  onChangeNote: (value: string) => void;
  onSubmit: () => void;
  onOpenRoomPreview: () => void;
  labels: {
    featured: string;
    aiAction: string;
    orderAction: string;
    roomPreviewAction: string;
    price: string;
    sizes: string;
    description: string;
    specs: string;
    note: string;
    notePlaceholder: string;
    orderSending: string;
    orderNow: string;
  };
  theme: ThemeMode;
}

const ProductInfoPanel: React.FC<ProductInfoPanelProps> = ({
  product,
  selectedSizeLabel,
  selectedPriceLabel,
  note,
  isSubmitting,
  orderMessage,
  orderStatus,
  onSelectSize,
  onChangeNote,
  onSubmit,
  onOpenRoomPreview,
  labels,
  theme,
}) => (
  <section className={`order-3 rounded-[32px] border p-5 shadow-[0_20px_80px_rgba(84,102,140,0.14)] backdrop-blur-2xl lg:order-1 ${
    theme === 'dark'
      ? 'border-white/10 bg-[linear-gradient(145deg,_rgba(31,37,52,0.72),_rgba(18,21,29,0.54))]'
      : 'border-white/75 bg-[linear-gradient(145deg,_rgba(255,255,255,0.56),_rgba(239,245,255,0.4))]'
  }`}>
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className={`font-display text-3xl ${theme === 'dark' ? 'text-stone-100' : 'text-stone-900'}`}>{product.name}</h2>
        <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>{product.category}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpenRoomPreview}
            className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
              theme === 'dark'
                ? 'border-sky-200/20 bg-sky-200/10 text-sky-100 hover:bg-sky-200/20'
                : 'border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100'
            }`}
          >
            {labels.roomPreviewAction}
          </button>
          <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
            theme === 'dark'
              ? 'border-emerald-200/20 bg-emerald-200/10 text-emerald-100'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}>
            {labels.orderAction}
          </span>
        </div>
      </div>
      {product.featured && (
        <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
          theme === 'dark'
            ? 'border-amber-200/20 bg-amber-100 text-stone-900'
            : 'border-amber-300/80 bg-amber-50 text-amber-900'
        }`}>
          {labels.featured}
        </span>
      )}
    </div>

    <div className={`mt-5 rounded-[24px] border p-4 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/80 bg-white/42'}`}>
      <div className={`text-[11px] uppercase tracking-[0.22em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>{labels.price}</div>
      <div className={`mt-2 text-3xl font-semibold ${theme === 'dark' ? 'text-stone-100' : 'text-stone-900'}`}>{selectedPriceLabel}</div>
    </div>

    <div className="mt-5">
      <div className={`text-[11px] uppercase tracking-[0.22em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>{labels.sizes}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {product.sizes.map((size) => {
          const active = selectedSizeLabel === size.label;

          return (
            <button
              key={size.label}
              type="button"
              onClick={() => onSelectSize(size.label)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                active
                  ? theme === 'dark'
                    ? 'border-amber-100 bg-amber-100 text-stone-900'
                    : 'border-stone-900 bg-stone-900 text-white'
                  : theme === 'dark'
                    ? 'border-white/10 bg-white/5 text-stone-300 hover:border-white/20'
                    : 'border-white/80 bg-white/56 text-stone-700 hover:border-white hover:bg-white/72'
              }`}
            >
              {size.label}
            </button>
          );
        })}
      </div>
    </div>

    <div className="mt-5">
      <div className={`text-[11px] uppercase tracking-[0.22em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>{labels.description}</div>
      <p className={`mt-3 text-sm leading-6 ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>{product.description}</p>
    </div>

    <div className="mt-5">
      <div className={`text-[11px] uppercase tracking-[0.22em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>{labels.specs}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {product.specs.map((spec) => (
          <span
            key={spec}
            className={`rounded-full border px-3 py-2 text-xs font-medium ${
              theme === 'dark'
                ? 'border-white/10 bg-white/5 text-stone-300'
                : 'border-white/80 bg-white/46 text-stone-600'
            }`}
          >
            {spec}
          </span>
        ))}
      </div>
    </div>

    <div className={`mt-5 rounded-[24px] border p-4 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/80 bg-white/42'}`}>
      <div className={`text-[11px] uppercase tracking-[0.22em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>{labels.note}</div>
      <textarea
        value={note}
        onChange={(event) => onChangeNote(event.target.value)}
        rows={3}
        className={`mt-3 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
          theme === 'dark'
            ? 'border-white/10 bg-stone-950/80 text-stone-100 placeholder:text-stone-500 focus:border-white/20'
            : 'border-white/80 bg-white/62 text-stone-700 placeholder:text-stone-400 focus:border-white'
        }`}
        placeholder={labels.notePlaceholder}
      />
    </div>

    <button
      type="button"
      onClick={onSubmit}
      disabled={isSubmitting}
      className={`mt-5 hidden w-full rounded-[22px] px-5 py-4 text-sm font-semibold shadow-[0_18px_30px_rgba(28,25,23,0.22)] transition disabled:cursor-not-allowed disabled:opacity-60 lg:inline-flex lg:items-center lg:justify-center ${
        theme === 'dark'
          ? 'bg-amber-100 text-stone-900 hover:bg-amber-50'
          : 'border border-white/85 bg-[rgba(255,255,255,0.7)] text-stone-900 hover:bg-[rgba(255,255,255,0.82)]'
      }`}
    >
      {isSubmitting ? labels.orderSending : labels.orderNow}
    </button>

    {orderStatus !== 'idle' && (
      <div
        className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
          orderStatus === 'success'
            ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border border-rose-200 bg-rose-50 text-rose-700'
        }`}
      >
        {orderMessage}
      </div>
    )}
  </section>
);

export default ProductInfoPanel;
