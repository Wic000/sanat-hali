import React from 'react';
import { Product, ThemeMode } from '../types';

interface ProductGalleryPanelProps {
  product: Product;
  selectedImage: string;
  gallery: string[];
  onSelectImage: (image: string) => void;
  zoomLabel: string;
  backLabel: string;
  onBack: () => void;
  theme: ThemeMode;
}

const ProductGalleryPanel: React.FC<ProductGalleryPanelProps> = ({
  product,
  selectedImage,
  gallery,
  onSelectImage,
  zoomLabel,
  backLabel,
  onBack,
  theme,
}) => (
  <section className={`order-1 rounded-[30px] border p-4 shadow-[0_18px_70px_rgba(88,63,37,0.1)] backdrop-blur-xl lg:order-2 ${
    theme === 'dark'
      ? 'border-white/10 bg-[rgba(28,24,21,0.82)]'
      : 'border-white/60 bg-[rgba(255,251,245,0.72)]'
  }`}>
    <div className="mb-3 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onBack}
        className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
          theme === 'dark'
            ? 'border-white/10 bg-white/5 text-stone-200 hover:border-white/20 hover:bg-white/10'
            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
        }`}
      >
        {backLabel}
      </button>
      <div className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${
        theme === 'dark'
          ? 'border-white/10 bg-white/5 text-stone-300'
          : 'border-stone-200 bg-white/70 text-stone-600'
      }`}>
        {product.name}
      </div>
    </div>

    <div className={`overflow-hidden rounded-[28px] border p-3 ${theme === 'dark' ? 'border-white/10 bg-[linear-gradient(140deg,_rgba(42,37,33,0.95),_rgba(24,24,24,0.75))]' : 'border-stone-900/6 bg-[linear-gradient(140deg,_rgba(245,239,231,0.95),_rgba(255,255,255,0.75))]'}`}>
      <div className="group relative overflow-hidden rounded-[24px] bg-[#ede6dc]">
        <img
          src={selectedImage}
          alt={product.name}
          className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.04] sm:aspect-[5/4] lg:aspect-[4/5]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,_rgba(255,255,255,0.0),_rgba(0,0,0,0.18))]" />
        <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md">
          {zoomLabel}
        </div>
      </div>
    </div>

    <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
      {gallery.map((image, index) => {
        const active = image === selectedImage;

        return (
          <button
            key={`${product.id}-${image}-${index}`}
            type="button"
            onClick={() => onSelectImage(image)}
            className={`overflow-hidden rounded-[20px] border p-1 transition ${
              active
                ? 'border-stone-900 bg-stone-900 shadow-[0_12px_24px_rgba(28,25,23,0.16)]'
                : 'border-white/60 bg-white/70 hover:border-stone-300'
            }`}
          >
            <img
              src={image}
              alt={`${product.name} preview ${index + 1}`}
              className="aspect-square w-full rounded-2xl object-cover"
            />
          </button>
        );
      })}
    </div>
  </section>
);

export default ProductGalleryPanel;
