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
import { AppLang, Product, RoomDimensions, RoomPlacementMode, TelegramUser, ThemeMode } from './types';

const TELEGRAM_ORDER_ENDPOINT = '/api/send-order';
const LANG_STORAGE_KEY = 'sanat-hali-lang';
const THEME_STORAGE_KEY = 'sanat-hali-theme';

const formatPrice = (value: number) =>
  `${new Intl.NumberFormat('en-US').format(value).replace(/,/g, ' ')} so'm`;

const getInitialTelegramUser = (): TelegramUser | null =>
  window.Telegram?.WebApp?.initDataUnsafe?.user ?? null;

const App: React.FC = () => {
  const tg = window.Telegram?.WebApp;
  const telegramUser = getInitialTelegramUser();

  const [lang, setLang] = useState<AppLang>(() => {
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY) as AppLang | null;
    return saved || detectInitialLang(telegramUser?.language_code);
  });
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    return saved || tg?.colorScheme || 'light';
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProductId, setSelectedProductId] = useState(DEFAULT_PRODUCTS[0].id);
  const [selectedImage, setSelectedImage] = useState(DEFAULT_PRODUCTS[0].images[0]);
  const [selectedSizeLabel, setSelectedSizeLabel] = useState(DEFAULT_PRODUCTS[0].sizes[0].label);
  const [note, setNote] = useState('');
  const [phone, setPhone] = useState(telegramUser?.phone_number ?? '');
  const [roomPlacementMode, setRoomPlacementMode] = useState<RoomPlacementMode>('center');
  const [roomDimensions, setRoomDimensions] = useState<RoomDimensions>({ width: '4.0', height: '5.5' });
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [demoPreviewApplied, setDemoPreviewApplied] = useState(false);
  const [showRoomPreview, setShowRoomPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [orderFeedback, setOrderFeedback] = useState<{ status: 'idle' | 'success' | 'error'; message: string }>({
    status: 'idle',
    message: '',
  });

  const isAdmin = Boolean(
    telegramUser &&
      typeof telegramUser.id === 'number' &&
      ADMIN_TELEGRAM_IDS.includes(Number(telegramUser.id))
  );

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
    if (!isAdmin) {
      setShowAdminPanel(false);
    }
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
    const source =
      selectedCategory === 'All'
        ? DEFAULT_PRODUCTS
        : DEFAULT_PRODUCTS.filter((product) => product.category === selectedCategory);

    return source.map((product) => localizeProduct(product, lang));
  }, [selectedCategory, lang]);

  const selectedProduct = useMemo(() => {
    return (
      filteredProducts.find((product) => product.id === selectedProductId) ||
      DEFAULT_PRODUCTS.map((product) => localizeProduct(product, lang)).find((product) => product.id === selectedProductId) ||
      filteredProducts[0] ||
      localizeProduct(DEFAULT_PRODUCTS[0], lang)
    );
  }, [filteredProducts, selectedProductId, lang]);

  useEffect(() => {
    setSelectedImage(selectedProduct.images[0]);
    setSelectedSizeLabel((current) => {
      const existing = selectedProduct.sizes.find((size) => size.label === current);
      return existing ? current : selectedProduct.sizes[0].label;
    });
    setDemoPreviewApplied(false);
  }, [selectedProduct]);

  const selectedSize =
    selectedProduct.sizes.find((size) => size.label === selectedSizeLabel) || selectedProduct.sizes[0];
  const selectedPrice = Math.round(selectedProduct.basePrice * selectedSize.multiplier);
  const selectedGallery = selectedProduct.images.slice(0, 5);

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

  const handleRoomUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setRoomImage(typeof reader.result === 'string' ? reader.result : null);
      setDemoPreviewApplied(false);
    };
    reader.readAsDataURL(file);
  };

  const submitOrder = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setOrderFeedback({ status: 'idle', message: '' });

    try {
      const response = await fetch(TELEGRAM_ORDER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || 'Order request failed');
      }

      tg?.HapticFeedback?.notificationOccurred?.('success');
      setOrderFeedback({
        status: 'success',
        message: t(lang, 'successOrder'),
      });
      setNote('');
    } catch (error) {
      tg?.HapticFeedback?.notificationOccurred?.('error');
      setOrderFeedback({
        status: 'error',
        message: error instanceof Error ? error.message : t(lang, 'orderError'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setSelectedImage(product.images[0]);
    setSelectedSizeLabel(product.sizes[0].label);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[radial-gradient(circle_at_top,_rgba(54,47,40,0.95),_rgba(28,24,21,0.92),_rgba(17,15,14,0.98))] text-stone-100' : 'bg-[radial-gradient(circle_at_top,_rgba(255,248,236,0.95),_rgba(242,234,220,0.82),_rgba(226,217,203,0.94)),linear-gradient(180deg,_#f4efe8_0%,_#ebe3d6_100%)] text-stone-900'}`}>
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 pb-10 pt-4 sm:px-5 lg:px-6">
        <ShowroomHeader
          telegramUser={telegramUser}
          isAdmin={isAdmin}
          showAdminPanel={showAdminPanel}
          lang={lang}
          theme={theme}
          languageLabel={t(lang, 'language')}
          themeLabel={`${t(lang, 'theme')}: ${theme === 'light' ? t(lang, 'light') : t(lang, 'dark')}`}
          customerLabel={t(lang, 'customer')}
          appBadge={t(lang, 'appBadge')}
          subtitle={t(lang, 'premiumShowroom')}
          adminOpenLabel={t(lang, 'adminPanel')}
          adminCloseLabel={t(lang, 'closeAdminPanel')}
          userMissingLabel={t(lang, 'userMissing')}
          usernameMissingLabel={t(lang, 'usernameMissing')}
          onToggleAdmin={() => setShowAdminPanel((value) => !value)}
          onToggleTheme={() => setTheme((current) => toggleTheme(current))}
          onChangeLang={setLang}
        />

        {showAdminPanel && isAdmin && (
          <AdminPanel
            telegramId={telegramUser?.id}
            summary={adminSummary}
            title={t(lang, 'adminHeading')}
            hint={t(lang, 'adminHint')}
            adminOnlyLabel={t(lang, 'adminOnly')}
            telegramUserLabel={t(lang, 'telegramUser')}
            theme={theme}
          />
        )}

        <CategoryChips
          categories={categories.map((item) => item.label)}
          selectedCategory={translateCategory(selectedCategory, lang)}
          onSelect={(label) => {
            const match = categories.find((item) => item.label === label);
            setSelectedCategory(match?.value || 'All');
          }}
          theme={theme}
        />

        <main className="grid gap-4 lg:grid-cols-[0.92fr_1.2fr_0.95fr] lg:items-start">
          <ProductInfoPanel
            product={selectedProduct}
            selectedSizeLabel={selectedSize.label}
            selectedPriceLabel={formatPrice(selectedPrice)}
            note={note}
            phone={phone}
            isSubmitting={isSubmitting}
            orderStatus={orderFeedback.status}
            orderMessage={orderFeedback.message}
            onSelectSize={setSelectedSizeLabel}
            onChangeNote={setNote}
            onChangePhone={setPhone}
            onSubmit={submitOrder}
            labels={{
              featured: t(lang, 'featured'),
              aiAction: t(lang, 'aiPreviewDemo'),
              orderAction: t(lang, 'orderNow'),
              price: t(lang, 'price'),
              sizes: t(lang, 'sizes'),
              description: t(lang, 'description'),
              specs: t(lang, 'specs'),
              note: t(lang, 'note'),
              notePlaceholder: t(lang, 'notePlaceholder'),
              phone: t(lang, 'phone'),
              orderSending: t(lang, 'orderSending'),
              orderNow: t(lang, 'orderNow'),
            }}
            theme={theme}
          />

          <ProductGalleryPanel
            product={selectedProduct}
            selectedImage={selectedImage}
            gallery={selectedGallery}
            onSelectImage={setSelectedImage}
            zoomLabel={t(lang, 'previewReady')}
            theme={theme}
          />

          <RoomPreviewPanel
            product={selectedProduct}
            roomImage={roomImage}
            roomPlacementMode={roomPlacementMode}
            roomDimensions={roomDimensions}
            demoPreviewApplied={demoPreviewApplied}
            isOpen={showRoomPreview}
            onOpen={() => setShowRoomPreview(true)}
            onClose={() => setShowRoomPreview(false)}
            onUpload={handleRoomUpload}
            onModeChange={(mode) => {
              setRoomPlacementMode(mode);
              setDemoPreviewApplied(false);
            }}
            onDimensionsChange={setRoomDimensions}
            onApply={() => setDemoPreviewApplied(true)}
            labels={{
              roomPreview: t(lang, 'roomPreview'),
              aiPreviewDemo: t(lang, 'aiPreviewDemo'),
              demoReady: t(lang, 'demoReady'),
              roomUploadHint: t(lang, 'roomUploadHint'),
              uploadRoomCta: t(lang, 'uploadRoomCta'),
              centerPlacement: t(lang, 'centerPlacement'),
              centerPlacementHint: t(lang, 'centerPlacementHint'),
              fullCoverage: t(lang, 'fullCoverage'),
              fullCoverageHint: t(lang, 'fullCoverageHint'),
              roomWidth: t(lang, 'roomWidth'),
              roomHeight: t(lang, 'roomHeight'),
              applyPreview: t(lang, 'applyPreview'),
              aiBlock: t(lang, 'aiBlock'),
              aiBlockHint: t(lang, 'aiBlockHint'),
              openPreview: t(lang, 'openPreview'),
              openPreviewHint: t(lang, 'openPreviewHint'),
              close: t(lang, 'close'),
              takeRoomShot: t(lang, 'takeRoomShot'),
            }}
            theme={theme}
          />
        </main>

        <section className="mt-4 lg:hidden">
          <button
            type="button"
            onClick={submitOrder}
            disabled={isSubmitting}
            className={`w-full rounded-[24px] px-5 py-4 text-sm font-semibold shadow-[0_18px_30px_rgba(28,25,23,0.22)] transition disabled:cursor-not-allowed disabled:opacity-60 ${
              theme === 'dark'
                ? 'bg-amber-100 text-stone-900 hover:bg-amber-50'
                : 'bg-stone-900 text-white hover:bg-stone-800'
            }`}
          >
            {isSubmitting ? t(lang, 'orderSending') : t(lang, 'orderNow')}
          </button>
          {orderFeedback.status !== 'idle' && (
            <div
              className={`mt-3 rounded-2xl px-4 py-3 text-sm ${
                orderFeedback.status === 'success'
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border border-rose-200 bg-rose-50 text-rose-700'
              }`}
            >
              {orderFeedback.message}
            </div>
          )}
        </section>

        <ProductRail
          products={filteredProducts}
          selectedProductId={selectedProduct.id}
          formatPrice={formatPrice}
          onSelect={handleSelectProduct}
          collectionLabel={t(lang, 'collection')}
          title={t(lang, 'supportingGallery')}
          modelsLabel={t(lang, 'models')}
          premiumLabel={t(lang, 'featured')}
          theme={theme}
        />

        <HeroBanner
          badge={t(lang, 'heroBadge')}
          title={t(lang, 'heroTitle')}
          description={t(lang, 'heroDescription')}
          metrics={[
            { label: t(lang, 'products'), value: SHOWROOM_COPY.metrics[0].value },
            { label: t(lang, 'galleryShots'), value: SHOWROOM_COPY.metrics[1].value },
            { label: t(lang, 'orderRoute'), value: t(lang, 'telegramBot') },
          ]}
          theme={theme}
        />
      </div>
    </div>
  );
};

export default App;
