import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Product, ProductSize, ThemeMode } from '../types';

interface AdminDashboardProps {
  products: Product[];
  formatPrice: (value: number) => string;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onBackHome: () => void;
  onSaveProducts: (products: Product[]) => Promise<void> | void;
  onResetProducts: () => Promise<void> | void;
  storageLabel: string;
  isSaving: boolean;
}

type AdminSection = 'products' | 'orders' | 'uploads' | 'settings';

const createEmptyProduct = (): Product => ({
  id: `product-${Date.now()}`,
  name: '',
  category: 'Classic',
  basePrice: 0,
  images: [],
  sizes: [
    { label: '200 x 300 cm', multiplier: 1 },
    { label: '250 x 350 cm', multiplier: 1.2 },
  ],
  description: '',
  specs: [],
  featured: false,
  visible: true,
});

const cloneProducts = (products: Product[]) => JSON.parse(JSON.stringify(products)) as Product[];

const parseList = (value: string) =>
  value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

const formatList = (items: string[]) => items.join('\n');

const formatSizes = (sizes: ProductSize[]) => sizes.map((size) => `${size.label}|${size.multiplier}`).join('\n');

const parseSizes = (value: string) =>
  value
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => {
      const [label, multiplierRaw] = row.split('|');
      const multiplier = Number(multiplierRaw);
      return {
        label: label?.trim() || '200 x 300 cm',
        multiplier: Number.isFinite(multiplier) && multiplier > 0 ? multiplier : 1,
      };
    });

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  formatPrice,
  theme,
  onToggleTheme,
  onBackHome,
  onSaveProducts,
  onResetProducts,
  storageLabel,
  isSaving,
}) => {
  const [section, setSection] = useState<AdminSection>('products');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [draftProducts, setDraftProducts] = useState<Product[]>(() => cloneProducts(products));
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [uploadMessage, setUploadMessage] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const cloned = cloneProducts(products);
    setDraftProducts(cloned);
    setSelectedProductId((current) => (cloned.some((item) => item.id === current) ? current : cloned[0]?.id || ''));
  }, [products]);

  const categories = useMemo(() => ['All', ...Array.from(new Set(draftProducts.map((item) => item.category)))], [draftProducts]);

  const filteredProducts = useMemo(
    () =>
      draftProducts.filter((product) => {
        const matchesQuery =
          !query ||
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = category === 'All' || product.category === category;
        return matchesQuery && matchesCategory;
      }),
    [draftProducts, query, category]
  );

  const selectedProduct =
    draftProducts.find((item) => item.id === selectedProductId) || filteredProducts[0] || draftProducts[0] || null;

  useEffect(() => {
    if (selectedProduct && selectedProduct.id !== selectedProductId) {
      setSelectedProductId(selectedProduct.id);
    }
  }, [selectedProduct, selectedProductId]);

  const totalVisible = draftProducts.filter((item) => item.visible !== false).length;
  const totalFeatured = draftProducts.filter((item) => item.featured).length;

  const panelClass =
    theme === 'dark'
      ? 'border-white/10 bg-[linear-gradient(160deg,_rgba(20,20,24,0.88),_rgba(32,30,36,0.74))] text-stone-100'
      : 'border-white/70 bg-[linear-gradient(160deg,_rgba(255,255,255,0.72),_rgba(241,245,252,0.58))] text-stone-900';

  const updateSelectedProduct = (updater: (product: Product) => Product) => {
    if (!selectedProduct) return;
    setDraftProducts((current) => current.map((item) => (item.id === selectedProduct.id ? updater(item) : item)));
  };

  const handleAddProduct = () => {
    const fresh = createEmptyProduct();
    setDraftProducts((current) => [fresh, ...current]);
    setSelectedProductId(fresh.id);
    setSection('products');
  };

  const handleDeleteProduct = () => {
    if (!selectedProduct) return;
    setDraftProducts((current) => current.filter((item) => item.id !== selectedProduct.id));
    setSelectedProductId('');
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(draftProducts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sanat-hali-products.json';
    link.click();
    URL.revokeObjectURL(url);
    setUploadMessage("Katalog JSON eksport qilindi.");
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Product[];
      if (!Array.isArray(parsed) || !parsed.length) throw new Error("Bo'sh katalog");
      setDraftProducts(parsed);
      setSelectedProductId(parsed[0]?.id || '');
      setUploadMessage('Katalog JSON import qilindi.');
    } catch (error) {
      setUploadMessage(error instanceof Error ? error.message : 'Import xatosi');
    } finally {
      event.target.value = '';
    }
  };

  const handleSave = async () => {
    try {
      await onSaveProducts(cloneProducts(draftProducts));
      setSaveMessage("Katalog muvaffaqiyatli saqlandi.");
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : "Saqlashda xato bo'ldi.");
    }
  };

  const handleReset = async () => {
    try {
      await onResetProducts();
      setSaveMessage('Default katalog qaytarildi.');
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : "Reset qilishda xato bo'ldi.");
    }
  };

  return (
    <div className={`min-h-screen px-4 py-5 sm:px-6 ${theme === 'dark' ? 'bg-[#0f1014]' : 'bg-[#eef1f6]'}`}>
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4">
        <section className={`rounded-[28px] border p-5 shadow-[0_24px_80px_rgba(20,18,16,0.18)] backdrop-blur-2xl ${panelClass}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className={`text-[11px] uppercase tracking-[0.28em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>Web Admin</p>
              <h1 className="mt-2 font-display text-4xl">Sanat Hali boshqaruv paneli</h1>
              <p className={`mt-2 max-w-3xl text-sm ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>
                Mahsulotlar, zakaz oqimi va katalog eksport/importini shu yerda boshqarasiz.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={onToggleTheme} className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${panelClass}`}>
                {theme === 'dark' ? "Yorug' tema" : 'Tungi tema'}
              </button>
              <button type="button" onClick={onBackHome} className="rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white">
                Showroomga qaytish
              </button>
            </div>
          </div>
          <div className={`mt-4 inline-flex rounded-2xl border px-4 py-2 text-sm ${panelClass}`}>
            Storage: {storageLabel}{isSaving ? ' · saqlanmoqda...' : ''}
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className={`rounded-2xl border p-4 ${panelClass}`}>
              <div className="text-[11px] uppercase tracking-[0.22em] opacity-70">Mahsulotlar</div>
              <div className="mt-2 text-2xl font-semibold">{draftProducts.length}</div>
            </div>
            <div className={`rounded-2xl border p-4 ${panelClass}`}>
              <div className="text-[11px] uppercase tracking-[0.22em] opacity-70">Ko'rinadigan</div>
              <div className="mt-2 text-2xl font-semibold">{totalVisible}</div>
            </div>
            <div className={`rounded-2xl border p-4 ${panelClass}`}>
              <div className="text-[11px] uppercase tracking-[0.22em] opacity-70">Featured</div>
              <div className="mt-2 text-2xl font-semibold">{totalFeatured}</div>
            </div>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[270px_minmax(0,1fr)]">
          <aside className={`rounded-[28px] border p-4 shadow-[0_24px_80px_rgba(20,18,16,0.12)] backdrop-blur-2xl ${panelClass}`}>
            <div className="space-y-2">
              {[
                { id: 'products', label: 'Mahsulotlar' },
                { id: 'orders', label: 'Buyurtmalar' },
                { id: 'uploads', label: 'Import / Export' },
                { id: 'settings', label: 'Sozlamalar' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id as AdminSection)}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    section === item.id
                      ? theme === 'dark'
                        ? 'bg-amber-100 text-stone-900'
                        : 'bg-stone-900 text-white'
                      : theme === 'dark'
                        ? 'bg-white/5 text-stone-200'
                        : 'bg-white text-stone-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className={`mt-6 rounded-2xl border p-4 text-sm ${panelClass}`}>
              <div className="font-semibold">Tez amallar</div>
              <div className="mt-3 flex flex-col gap-2">
                <button type="button" onClick={handleAddProduct} className="rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white">
                  Yangi mahsulot
                </button>
                <button type="button" onClick={handleSave} className="rounded-2xl bg-blue-500 px-4 py-3 font-semibold text-white" disabled={isSaving}>
                  Katalogni saqlash
                </button>
              </div>
            </div>
          </aside>

          <section className={`rounded-[28px] border p-4 shadow-[0_24px_80px_rgba(20,18,16,0.12)] backdrop-blur-2xl ${panelClass}`}>
            {section === 'products' && (
              <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
                <div className="space-y-4">
                  <div className="grid gap-3">
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Qidirish..."
                      className={`rounded-2xl border px-4 py-3 text-sm outline-none ${panelClass}`}
                    />
                    <select
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className={`rounded-2xl border px-4 py-3 text-sm outline-none ${panelClass}`}
                    >
                      {categories.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => setSelectedProductId(product.id)}
                        className={`w-full rounded-[24px] border p-4 text-left transition ${
                          selectedProduct?.id === product.id
                            ? theme === 'dark'
                              ? 'border-amber-200/60 bg-amber-100/10'
                              : 'border-stone-900/30 bg-stone-900/5'
                            : ''
                        } ${panelClass}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold">{product.name}</div>
                            <div className={`mt-1 text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>{product.category}</div>
                          </div>
                          <div className="text-sm font-semibold">{formatPrice(product.basePrice)}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  {!selectedProduct ? (
                    <div className={`rounded-[24px] border p-8 text-sm ${panelClass}`}>Mahsulot tanlang yoki yangi mahsulot qo'shing.</div>
                  ) : (
                    <div className="space-y-4">
                      <div className={`rounded-[26px] border p-4 ${panelClass}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.22em] opacity-70">Preview</div>
                            <div className="mt-2 text-lg font-semibold">{selectedProduct.name || 'Yangi mahsulot'}</div>
                            <div className={`mt-1 text-sm ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>
                              {selectedProduct.category || 'Kategoriya yoq'}
                            </div>
                          </div>
                          <div className="text-sm font-semibold">{formatPrice(selectedProduct.basePrice || 0)}</div>
                        </div>
                        <div className="mt-4 overflow-hidden rounded-[22px] border border-black/5 bg-black/5">
                          {selectedProduct.images[0] ? (
                            <img
                              src={selectedProduct.images[0]}
                              alt={selectedProduct.name || 'Product preview'}
                              className="h-[280px] w-full object-cover"
                            />
                          ) : (
                            <div className={`flex h-[280px] items-center justify-center text-sm ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                              Asosiy rasm hali kiritilmagan
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button type="button" onClick={handleAddProduct} className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white">
                          Yangi mahsulot
                        </button>
                        <button type="button" onClick={handleDeleteProduct} className="rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white">
                          O'chirish
                        </button>
                        <button type="button" onClick={handleSave} className="rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white" disabled={isSaving}>
                          Saqlash
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <input value={selectedProduct.name} onChange={(event) => updateSelectedProduct((item) => ({ ...item, name: event.target.value }))} placeholder="Mahsulot nomi" className={`rounded-2xl border px-4 py-3 text-sm outline-none ${panelClass}`} />
                        <input value={selectedProduct.category} onChange={(event) => updateSelectedProduct((item) => ({ ...item, category: event.target.value }))} placeholder="Kategoriya" className={`rounded-2xl border px-4 py-3 text-sm outline-none ${panelClass}`} />
                        <input value={selectedProduct.basePrice} onChange={(event) => updateSelectedProduct((item) => ({ ...item, basePrice: Number(event.target.value) || 0 }))} placeholder="Narx" className={`rounded-2xl border px-4 py-3 text-sm outline-none ${panelClass}`} />
                        <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm ${panelClass}`}>
                          <span>Featured</span>
                          <input type="checkbox" checked={Boolean(selectedProduct.featured)} onChange={(event) => updateSelectedProduct((item) => ({ ...item, featured: event.target.checked }))} />
                        </div>
                        <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm ${panelClass}`}>
                          <span>Ko'rinadi</span>
                          <input type="checkbox" checked={selectedProduct.visible !== false} onChange={(event) => updateSelectedProduct((item) => ({ ...item, visible: event.target.checked }))} />
                        </div>
                      </div>

                      <textarea value={selectedProduct.description} onChange={(event) => updateSelectedProduct((item) => ({ ...item, description: event.target.value }))} placeholder="Tavsif" rows={4} className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ${panelClass}`} />

                      <div className="grid gap-4 md:grid-cols-3">
                        <textarea value={formatList(selectedProduct.images)} onChange={(event) => updateSelectedProduct((item) => ({ ...item, images: parseList(event.target.value) }))} placeholder="Rasm yo'llari, har qatorda bittadan" rows={6} className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ${panelClass}`} />
                        <textarea value={formatList(selectedProduct.specs)} onChange={(event) => updateSelectedProduct((item) => ({ ...item, specs: parseList(event.target.value) }))} placeholder="Specs, har qatorda bittadan" rows={6} className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ${panelClass}`} />
                        <textarea value={formatSizes(selectedProduct.sizes)} onChange={(event) => updateSelectedProduct((item) => ({ ...item, sizes: parseSizes(event.target.value) }))} placeholder="200 x 300 cm|1" rows={6} className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ${panelClass}`} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {section === 'orders' && (
              <div className="space-y-4">
                <div className={`rounded-[24px] border p-5 text-sm leading-7 ${panelClass}`}>
                  Buyurtmalar hozir Telegram bot orqali kelmoqda. Keyingi bosqichda shu yerga real orders jadvali, statuslar va preview rasmi bilan CRM oqimini ulash mumkin.
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className={`rounded-[24px] border p-5 ${panelClass}`}>
                    <div className="font-semibold">Hozir ishlayotgan oqim</div>
                    <ul className={`mt-3 space-y-2 text-sm ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>
                      <li>Buyurtma admin Telegramga boradi</li>
                      <li>Telefon va preview rasmi birga yuboriladi</li>
                      <li>Mahsulot, o'lcham va narx ko'rinadi</li>
                    </ul>
                  </div>
                  <div className={`rounded-[24px] border p-5 ${panelClass}`}>
                    <div className="font-semibold">Keyingi qo'shish mumkin</div>
                    <ul className={`mt-3 space-y-2 text-sm ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>
                      <li>Zakaz statuslari</li>
                      <li>Jadval ko'rinishi</li>
                      <li>Qidiruv va filtr</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {section === 'uploads' && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={handleExport} className="rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white">
                    JSON eksport
                  </button>
                  <label className="cursor-pointer rounded-2xl bg-amber-100 px-4 py-3 text-sm font-semibold text-stone-900">
                    JSON import
                    <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
                  </label>
                </div>
                <div className={`rounded-[24px] border p-5 text-sm ${panelClass}`}>
                  {uploadMessage || saveMessage || "Bu yerda katalogni JSON ko'rinishida eksport yoki import qilishingiz mumkin."}
                </div>
              </div>
            )}

            {section === 'settings' && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={handleSave} className="rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white" disabled={isSaving}>
                    Hozirgi katalogni saqlash
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white"
                    disabled={isSaving}
                  >
                    Default katalogni qaytarish
                  </button>
                </div>
                <div className={`rounded-[24px] border p-5 text-sm ${panelClass}`}>
                  Bu panel hozir brauzer localStorage bilan ishlayapti. Keyingi bosqichda shu joydan Supabase products va image storage ga o'tamiz.
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
