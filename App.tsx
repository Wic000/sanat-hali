import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import AdminPanel from './components/AdminPanel';
import CategoryChips from './components/CategoryChips';
import HeroBanner from './components/HeroBanner';
import ProductGalleryPanel from './components/ProductGalleryPanel';
import ProductInfoPanel from './components/ProductInfoPanel';
import ProductRail from './components/ProductRail';
import RoomPreviewPanel from './components/RoomPreviewPanel';
import ShowroomHeader from './components/ShowroomHeader';
import { ADMIN_TELEGRAM_IDS, DEFAULT_PRODUCTS, SHOWROOM_COPY } from './constants';
import { detectInitialLang, localizeProduct, t, toggleTheme, translateCategory } from './i18n';
import { AppLang, Product, RoomDimensions, RoomPlacementMode, RoomPreviewResult, TelegramUser, ThemeMode } from './types';

const TELEGRAM_ORDER_ENDPOINT = '/api/send-order';
const ROOM_PREVIEW_ENDPOINT = '/api/room-preview';
const LANG_STORAGE_KEY = 'sanat-hali-lang';
const THEME_STORAGE_KEY = 'sanat-hali-theme';

const formatPrice = (value: number) =>
  `${new Intl.NumberFormat('en-US').format(value).replace(/,/g, ' ')} so'm`;

const parseJsonResponse = async (response: Response) => {
  const rawText = await response.text();
  try {
    return rawText ? JSON.parse(rawText) : {};
  } catch {
    return { error: rawText || 'Unexpected server response' };
  }
};

const getInitialTelegramUser = (): TelegramUser | null =>
  window.Telegram?.WebApp?.initDataUnsafe?.user ?? null;

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Failed to read image'));
    reader.readAsDataURL(file);
  });

const resizeImageDataUrl = (source: string, maxSide = 1280) =>
  new Promise<string>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const largestSide = Math.max(image.width, image.height);
      if (!largestSide || largestSide <= maxSide) {
        resolve(source);
        return;
      }
      const scale = maxSide / largestSide;
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Canvas context unavailable'));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    image.onerror = () => reject(new Error('Failed to load image'));
    image.src = source;
  });

const loadImageElement = (source: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load image asset'));
    image.src = source;
  });

const createBaseRoomPreview = async ({
  roomImage,
  rugImage,
  placementMode,
}: {
  roomImage: string;
  rugImage: string;
  placementMode: RoomPlacementMode;
}) => {
  const [room, rug] = await Promise.all([loadImageElement(roomImage), loadImageElement(rugImage)]);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas context unavailable');
  }
  canvas.width = room.width;
  canvas.height = room.height;
  context.drawImage(room, 0, 0, canvas.width, canvas.height);

  const rugWidth = canvas.width * (placementMode === 'coverage' ? 0.76 : 0.5);
  const rugHeight = rugWidth * 0.68;
  const bottomWidth = rugWidth * (placementMode === 'coverage' ? 1.3 : 1.18);
  const topY = canvas.height * (placementMode === 'coverage' ? 0.56 : 0.65);
  const bottomY = canvas.height * (placementMode === 'coverage' ? 0.95 : 0.9);
  const centerX = canvas.width * 0.5;

  context.save();
  context.beginPath();
  context.moveTo(centerX - rugWidth / 2, topY);
  context.lineTo(centerX + rugWidth / 2, topY);
  context.lineTo(centerX + bottomWidth / 2, bottomY);
  context.lineTo(centerX - bottomWidth / 2, bottomY);
  context.closePath();
  context.clip();
  context.drawImage(rug, centerX - rugWidth / 2, topY, rugWidth, rugHeight);
  context.restore();

  context.save();
  context.beginPath();
  context.moveTo(centerX - rugWidth / 2, topY);
  context.lineTo(centerX + rugWidth / 2, topY);
  context.lineTo(centerX + bottomWidth / 2, bottomY);
  context.lineTo(centerX - bottomWidth / 2, bottomY);
  context.closePath();
  context.strokeStyle = 'rgba(255,255,255,0.28)';
  context.lineWidth = Math.max(2, canvas.width * 0.0032);
  context.stroke();
  context.restore();

  return canvas.toDataURL('image/jpeg', 0.92);
};

const App: React.FC = () => {
  const tg = window.Telegram?.WebApp;
  const [telegramUser] = useState<TelegramUser | null>(() => getInitialTelegramUser());
  const [lang, setLang] = useState<AppLang>(() => {
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY) as AppLang | null;
    return saved || detectInitialLang(telegramUser?.language_code);
  });
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    return saved || tg?.colorScheme || 'light';
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSizeLabel, setSelectedSizeLabel] = useState('');
  const [note, setNote] = useState('');
  const [phone, setPhone] = useState('');
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [roomPlacementMode, setRoomPlacementMode] = useState<RoomPlacementMode>('center');
  const [roomDimensions, setRoomDimensions] = useState<RoomDimensions>({ width: '4.0', height: '5.5' });
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [generatedRoomPreview, setGeneratedRoomPreview] = useState<RoomPreviewResult | null>(null);
  const [showRoomPreview, setShowRoomPreview] = useState(false);
  const [isGeneratingRoomPreview, setIsGeneratingRoomPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [roomPreviewError, setRoomPreviewError] = useState('');
  const [orderFeedback, setOrderFeedback] = useState<{ status: 'idle' | 'success' | 'error'; message: string }>({
    status: 'idle',
    message: '',
  });

  const isAdmin = Boolean(telegramUser && typeof telegramUser.id === 'number' && ADMIN_TELEGRAM_IDS.includes(Number(telegramUser.id)));

  useEffect(() => {
    tg?.ready();
    tg?.expand();
  }, [tg]);

  useEffect(() => {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  }, [lang]);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (!isAdmin) setShowAdminPanel(false);
  }, [isAdmin]);

  const categories = useMemo(
    () =>
      ['All', ...Array.from(new Set(DEFAULT_PRODUCTS.map((product) => product.category)))].map((category) => ({
        value: category,
        label: translateCategory(category, lang),
      })),
    [lang]
  );

  const filteredProducts = useMemo(() => {
    const source = selectedCategory === 'All' ? DEFAULT_PRODUCTS : DEFAULT_PRODUCTS.filter((product) => product.category === selectedCategory);
    return source.map((product) => localizeProduct(product, lang));
  }, [selectedCategory, lang]);

  const selectedProduct = useMemo(() => {
    if (!selectedProductId) return null;
    return (
      filteredProducts.find((product) => product.id === selectedProductId) ||
      DEFAULT_PRODUCTS.map((product) => localizeProduct(product, lang)).find((product) => product.id === selectedProductId) ||
      null
    );
  }, [filteredProducts, selectedProductId, lang]);

  useEffect(() => {
    if (!selectedProduct) return;
    setSelectedImage(selectedProduct.images[0]);
    setSelectedSizeLabel((current) => {
      const existing = selectedProduct.sizes.find((size) => size.label === current);
      return existing ? current : selectedProduct.sizes[0].label;
    });
  }, [selectedProduct]);

  useEffect(() => {
    if (!roomImage) return;
    setGeneratedRoomPreview(null);
    setRoomPreviewError('');
  }, [selectedProductId, selectedImage, roomPlacementMode, roomImage]);

  const selectedSize = selectedProduct
    ? selectedProduct.sizes.find((size) => size.label === selectedSizeLabel) || selectedProduct.sizes[0]
    : null;
  const selectedPrice = selectedProduct && selectedSize ? Math.round(selectedProduct.basePrice * selectedSize.multiplier) : 0;
  const selectedGallery = selectedProduct ? selectedProduct.images.slice(0, 5) : [];

  const adminSummary = useMemo(() => {
    const visibleProducts = DEFAULT_PRODUCTS.filter((product) => product.visible !== false).length;
    const featuredProducts = DEFAULT_PRODUCTS.filter((product) => product.featured).length;
    return [
      { label: 'Telegram ID', value: telegramUser?.id ? String(telegramUser.id) : 'Unknown' },
      { label: t(lang, 'products'), value: `${visibleProducts} ta` },
      { label: t(lang, 'featuredCount'), value: `${featuredProducts} ta` },
      { label: t(lang, 'dataSource'), value: t(lang, 'catalogSource') },
    ];
  }, [telegramUser?.id, lang]);

  const handleRoomUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imageSource = await readFileAsDataUrl(file);
      const resizedImage = await resizeImageDataUrl(imageSource);
      setRoomImage(resizedImage);
      setGeneratedRoomPreview(null);
      setRoomPreviewError('');
    } catch {
      setRoomPreviewError(t(lang, 'previewError'));
    }
  };

  const handleGenerateRoomPreview = async () => {
    if (!selectedProduct || !roomImage) {
      setRoomPreviewError(t(lang, 'previewMissingRoom'));
      return;
    }
    setIsGeneratingRoomPreview(true);
    setRoomPreviewError('');
    try {
      const basePreviewImage = await createBaseRoomPreview({
        roomImage,
        rugImage: selectedImage || selectedProduct.images[0],
        placementMode: roomPlacementMode,
      });
      const response = await fetch(ROOM_PREVIEW_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basePreviewImage,
          productName: selectedProduct.name,
          placementMode: roomPlacementMode,
          roomWidth: roomDimensions.width,
          roomHeight: roomDimensions.height,
        }),
      });
      const result = await parseJsonResponse(response);
      if (!response.ok || !result?.image) {
        throw new Error(result?.error || t(lang, 'previewError'));
      }
      setGeneratedRoomPreview({ image: result.image, provider: result.provider || 'openai' });
      tg?.HapticFeedback?.notificationOccurred?.('success');
    } catch (error) {
      setGeneratedRoomPreview(null);
      setRoomPreviewError(error instanceof Error ? error.message : t(lang, 'previewError'));
      tg?.HapticFeedback?.notificationOccurred?.('error');
    } finally {
      setIsGeneratingRoomPreview(false);
    }
  };

  const submitOrder = async () => {
    if (isSubmitting || !selectedProduct || !selectedSize) return;
    setIsSubmitting(true);
    setOrderFeedback({ status: 'idle', message: '' });
    try {
      const response = await fetch(TELEGRAM_ORDER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: telegramUser,
          phone: phone.trim() || telegramUser?.phone_number || null,
          productName: selectedProduct.name,
          size: selectedSize.label,
          price: selectedPrice,
          note: note.trim() || null,
          room: {
            placementMode: roomPlacementMode,
            width: roomDimensions.width,
            height: roomDimensions.height,
            hasRoomImage: Boolean(roomImage),
            hasGeneratedPreview: Boolean(generatedRoomPreview?.image),
            previewImage: generatedRoomPreview?.image || null,
          },
        }),
      });
      const result = await parseJsonResponse(response);
      if (!response.ok) throw new Error(result?.error || 'Order request failed');
      tg?.HapticFeedback?.notificationOccurred?.('success');
      setOrderFeedback({ status: 'success', message: t(lang, 'successOrder') });
      setNote('');
      setShowPhoneModal(false);
    } catch (error) {
      tg?.HapticFeedback?.notificationOccurred?.('error');
      setOrderFeedback({ status: 'error', message: error instanceof Error ? error.message : t(lang, 'orderError') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setSelectedImage(product.images[0]);
    setSelectedSizeLabel(product.sizes[0].label);
  };

  const handleOrderAction = () => {
    setOrderFeedback({ status: 'idle', message: '' });
    setPhone((current) => current || telegramUser?.phone_number || '');
    setShowPhoneModal(true);
  };

  const handleConfirmOrder = () => {
    if (!phone.trim() && !telegramUser?.phone_number) {
      setOrderFeedback({ status: 'error', message: t(lang, 'phoneRequired') });
      return;
    }
    submitOrder();
  };

  const handleClearSelection = () => {
    setSelectedProductId(null);
    setSelectedImage('');
    setSelectedSizeLabel('');
    setGeneratedRoomPreview(null);
    setRoomPreviewError('');
    setShowRoomPreview(false);
    setShowPhoneModal(false);
    setOrderFeedback({ status: 'idle', message: '' });
  };

  return (
    <div className={`ios-liquid-bg min-h-screen ${theme === 'dark' ? 'bg-[radial-gradient(circle_at_top,_rgba(53,62,86,0.52),_rgba(20,23,31,0.9),_rgba(10,12,18,0.98))] text-stone-100' : 'bg-[linear-gradient(180deg,_rgba(247,243,236,0.94)_0%,_rgba(231,226,217,0.92)_58%,_rgba(219,222,228,0.84)_100%)] text-stone-900'}`}>
      <div className={`ios-grid ${theme === 'dark' ? 'opacity-10' : ''}`} />
      <div className="ios-orb one" />
      <div className="ios-orb two" />
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 pb-10 pt-4 sm:px-5 lg:px-6">
        <ShowroomHeader telegramUser={telegramUser} isAdmin={isAdmin} showAdminPanel={showAdminPanel} lang={lang} theme={theme} languageLabel={t(lang, 'language')} themeLabel={`${t(lang, 'theme')}: ${theme === 'light' ? t(lang, 'light') : t(lang, 'dark')}`} customerLabel={t(lang, 'customer')} appBadge={t(lang, 'appBadge')} subtitle={t(lang, 'premiumShowroom')} adminOpenLabel={t(lang, 'adminPanel')} adminCloseLabel={t(lang, 'closeAdminPanel')} userMissingLabel={t(lang, 'userMissing')} usernameMissingLabel={t(lang, 'usernameMissing')} onToggleAdmin={() => setShowAdminPanel((value) => !value)} onToggleTheme={() => setTheme((current) => toggleTheme(current))} onChangeLang={setLang} />
        {showAdminPanel && isAdmin && <AdminPanel telegramId={telegramUser?.id} summary={adminSummary} title={t(lang, 'adminHeading')} hint={t(lang, 'adminHint')} adminOnlyLabel={t(lang, 'adminOnly')} telegramUserLabel={t(lang, 'telegramUser')} theme={theme} />}
        <CategoryChips categories={categories.map((item) => item.label)} selectedCategory={translateCategory(selectedCategory, lang)} onSelect={(label) => { const match = categories.find((item) => item.label === label); setSelectedCategory(match?.value || 'All'); }} theme={theme} />
        {selectedProduct && selectedSize && (
          <main className="grid gap-4 lg:grid-cols-[0.92fr_1.2fr_0.95fr] lg:items-start">
            <ProductInfoPanel product={selectedProduct} selectedSizeLabel={selectedSize.label} selectedPriceLabel={formatPrice(selectedPrice)} note={note} isSubmitting={isSubmitting} orderStatus={orderFeedback.status} orderMessage={orderFeedback.message} onSelectSize={setSelectedSizeLabel} onChangeNote={setNote} onSubmit={handleOrderAction} labels={{ featured: t(lang, 'featured'), aiAction: t(lang, 'aiPreviewDemo'), orderAction: t(lang, 'orderNow'), price: t(lang, 'price'), sizes: t(lang, 'sizes'), description: t(lang, 'description'), specs: t(lang, 'specs'), note: t(lang, 'note'), notePlaceholder: t(lang, 'notePlaceholder'), orderSending: t(lang, 'orderSending'), orderNow: t(lang, 'orderNow') }} theme={theme} />
            <ProductGalleryPanel product={selectedProduct} selectedImage={selectedImage} gallery={selectedGallery} onSelectImage={setSelectedImage} zoomLabel={t(lang, 'previewReady')} backLabel={t(lang, 'backToCollection')} closeLabel={t(lang, 'close')} zoomInLabel={t(lang, 'zoomIn')} zoomOutLabel={t(lang, 'zoomOut')} onBack={handleClearSelection} theme={theme} />
            <RoomPreviewPanel product={selectedProduct} roomImage={roomImage} generatedPreviewImage={generatedRoomPreview?.image || null} previewProvider={generatedRoomPreview?.provider || null} roomPlacementMode={roomPlacementMode} roomDimensions={roomDimensions} isOpen={showRoomPreview} isGenerating={isGeneratingRoomPreview} previewError={roomPreviewError} onOpen={() => setShowRoomPreview(true)} onClose={() => setShowRoomPreview(false)} onUpload={handleRoomUpload} onModeChange={setRoomPlacementMode} onDimensionsChange={setRoomDimensions} onApply={handleGenerateRoomPreview} labels={{ roomPreview: t(lang, 'roomPreview'), aiPreviewDemo: t(lang, 'aiPreviewDemo'), demoReady: t(lang, 'demoReady'), roomUploadHint: t(lang, 'roomUploadHint'), uploadRoomCta: t(lang, 'uploadRoomCta'), centerPlacement: t(lang, 'centerPlacement'), centerPlacementHint: t(lang, 'centerPlacementHint'), fullCoverage: t(lang, 'fullCoverage'), fullCoverageHint: t(lang, 'fullCoverageHint'), roomWidth: t(lang, 'roomWidth'), roomHeight: t(lang, 'roomHeight'), applyPreview: t(lang, 'applyPreview'), aiBlock: t(lang, 'aiBlock'), aiBlockHint: t(lang, 'aiBlockHint'), openPreview: t(lang, 'openPreview'), openPreviewHint: t(lang, 'openPreviewHint'), close: t(lang, 'close'), takeRoomShot: t(lang, 'takeRoomShot'), generatingPreview: t(lang, 'generatingPreview'), estimatedWait: t(lang, 'estimatedWait'), previewReadyStatus: t(lang, 'previewReadyStatus') }} theme={theme} />
          </main>
        )}
        <section className="mt-4 lg:hidden">
          <button type="button" onClick={handleOrderAction} disabled={isSubmitting || !selectedProduct} className={`w-full rounded-[24px] px-5 py-4 text-sm font-semibold shadow-[0_18px_30px_rgba(28,25,23,0.22)] transition disabled:cursor-not-allowed disabled:opacity-60 ${theme === 'dark' ? 'bg-amber-100 text-stone-900 hover:bg-amber-50' : 'bg-stone-900 text-white hover:bg-stone-800'}`}>
            {isSubmitting ? t(lang, 'orderSending') : t(lang, 'orderNow')}
          </button>
          {orderFeedback.status !== 'idle' && <div className={`mt-3 rounded-2xl px-4 py-3 text-sm ${orderFeedback.status === 'success' ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'border border-rose-200 bg-rose-50 text-rose-700'}`}>{orderFeedback.message}</div>}
        </section>
        <ProductRail products={filteredProducts} selectedProductId={selectedProduct?.id || null} formatPrice={formatPrice} onSelect={handleSelectProduct} collectionLabel={t(lang, 'collection')} title={t(lang, 'supportingGallery')} modelsLabel={t(lang, 'models')} premiumLabel={t(lang, 'featured')} theme={theme} />
        <HeroBanner badge={t(lang, 'heroBadge')} title={t(lang, 'heroTitle')} description={t(lang, 'heroDescription')} metrics={[{ label: t(lang, 'products'), value: SHOWROOM_COPY.metrics[0].value }, { label: t(lang, 'galleryShots'), value: SHOWROOM_COPY.metrics[1].value }, { label: t(lang, 'orderRoute'), value: t(lang, 'telegramBot') }]} theme={theme} />
      </div>
      {showPhoneModal && (
        <div className="fixed inset-0 z-[98] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-6">
          <div className={`w-full rounded-t-[28px] border p-5 shadow-[0_30px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:max-w-lg sm:rounded-[30px] ${theme === 'dark' ? 'border-white/10 bg-[linear-gradient(145deg,_rgba(26,31,42,0.86),_rgba(18,21,29,0.72))] text-stone-100' : 'border-white/70 bg-[linear-gradient(145deg,_rgba(255,255,255,0.72),_rgba(241,245,252,0.58))] text-stone-900'}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-3xl">{t(lang, 'phoneModalTitle')}</h3>
                <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>{t(lang, 'phoneModalHint')}</p>
              </div>
              <button type="button" onClick={() => setShowPhoneModal(false)} className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${theme === 'dark' ? 'border-white/10 bg-white/5 text-stone-100' : 'border-stone-200 bg-white text-stone-800'}`}>{t(lang, 'close')}</button>
            </div>
            <div className="mt-5">
              <label className={`block text-[11px] uppercase tracking-[0.22em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>{t(lang, 'phoneModalTitle')}</label>
              <input value={phone} onChange={(event) => setPhone(event.target.value)} className={`mt-3 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${theme === 'dark' ? 'border-white/10 bg-stone-950 text-stone-100 placeholder:text-stone-500 focus:border-white/20' : 'border-stone-200 bg-white text-stone-700 placeholder:text-stone-400 focus:border-stone-400'}`} placeholder={t(lang, 'phonePlaceholder')} />
            </div>
            <button type="button" onClick={handleConfirmOrder} disabled={isSubmitting} className={`mt-5 w-full rounded-[22px] px-5 py-4 text-sm font-semibold shadow-[0_18px_30px_rgba(28,25,23,0.22)] transition disabled:cursor-not-allowed disabled:opacity-60 ${theme === 'dark' ? 'bg-amber-100 text-stone-900 hover:bg-amber-50' : 'bg-stone-900 text-white hover:bg-stone-800'}`}>{isSubmitting ? t(lang, 'orderSending') : t(lang, 'confirmOrder')}</button>
            {orderFeedback.status !== 'idle' && <div className={`mt-4 rounded-2xl px-4 py-3 text-sm ${orderFeedback.status === 'success' ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'border border-rose-200 bg-rose-50 text-rose-700'}`}>{orderFeedback.message}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
