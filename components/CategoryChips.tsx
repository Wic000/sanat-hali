import React from 'react';
import { ThemeMode } from '../types';

interface CategoryChipsProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
  theme: ThemeMode;
}

const CategoryChips: React.FC<CategoryChipsProps> = ({ categories, selectedCategory, onSelect, theme }) => (
  <section className="mb-4">
    <div className="flex gap-3 overflow-x-auto pb-1">
      {categories.map((category) => {
        const active = category === selectedCategory;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                active
                ? theme === 'dark'
                  ? 'border-amber-100 bg-amber-100 text-stone-900 shadow-[0_14px_24px_rgba(28,25,23,0.16)]'
                  : 'border-stone-900 bg-stone-900 text-white shadow-[0_14px_24px_rgba(28,25,23,0.16)]'
                : theme === 'dark'
                  ? 'border-white/10 bg-white/5 text-stone-300 shadow-sm hover:border-white/20 hover:text-white'
                  : 'border-white/70 bg-white/75 text-stone-700 shadow-sm hover:border-stone-300 hover:text-stone-900'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  </section>
);

export default CategoryChips;
