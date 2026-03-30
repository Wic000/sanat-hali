import React, { ChangeEvent } from 'react';
import { Product, RoomDimensions, RoomPlacementMode, ThemeMode } from '../types';

interface RoomPreviewPanelProps {
  product: Product;
  roomImage: string | null;
  generatedPreviewImage: string | null;
  previewProvider: string | null;
  roomPlacementMode: RoomPlacementMode;
  roomDimensions: RoomDimensions;
  isOpen: boolean;
  isGenerating: boolean;
  previewError: string;
  onOpen: () => void;
  onClose: () => void;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onModeChange: (mode: RoomPlacementMode) => void;
  onDimensionsChange: React.Dispatch<React.SetStateAction<RoomDimensions>>;
  onApply: () => void;
  labels: {
    roomPreview: string;
    aiPreviewDemo: string;
    demoReady: string;
    roomUploadHint: string;
    uploadRoomCta: string;
    centerPlacement: string;
    centerPlacementHint: string;
    fullCoverage: string;
    fullCoverageHint: string;
    roomWidth: string;
    roomHeight: string;
    applyPreview: string;
    aiBlock: string;
    aiBlockHint: string;
    openPreview: string;
    openPreviewHint: string;
    close: string;
    takeRoomShot: string;
    generatingPreview: string;
    estimatedWait: string;
    previewReadyStatus: string;
  };
  theme: ThemeMode;
}

const RoomPreviewPanel: React.FC<RoomPreviewPanelProps> = ({
  product,
  roomImage,
  generatedPreviewImage,
  previewProvider,
  roomPlacementMode,
  roomDimensions,
  isOpen,
  isGenerating,
  previewError,
  onOpen,
  onClose,
  onUpload,
  onModeChange,
  onDimensionsChange,
  onApply,
  labels,
  theme,
}) => (
  <>
    <section
      className={`order-4 rounded-[32px] border p-5 shadow-[0_20px_80px_rgba(84,102,140,0.14)] backdrop-blur-2xl lg:order-3 ${
        theme === 'dark'
          ? 'border-white/10 bg-[linear-gradient(145deg,_rgba(31,37,52,0.72),_rgba(18,21,29,0.54))]'
          : 'border-white/75 bg-[linear-gradient(145deg,_rgba(255,255,255,0.56),_rgba(239,245,255,0.4))]'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-[11px] uppercase tracking-[0.24em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
            {labels.roomPreview}
          </p>
          <h2 className={`mt-2 max-w-[12rem] font-display text-[24px] leading-none sm:max-w-none sm:text-3xl ${theme === 'dark' ? 'text-stone-100' : 'text-stone-900'}`}>
            {labels.openPreview}
          </h2>
          <p className={`mt-2 text-sm leading-6 ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>
            {labels.openPreviewHint}
          </p>
        </div>
        <div
          className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
            theme === 'dark'
              ? 'border-white/10 bg-white/5 text-stone-200'
              : 'border-white/80 bg-[rgba(255,255,255,0.68)] text-stone-700'
          }`}
        >
          {labels.demoReady}
        </div>
      </div>

      <div className="mt-5">
        <div className={`rounded-[24px] border p-4 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/80 bg-white/42'}`}>
          <div className={`text-[11px] uppercase tracking-[0.22em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
            {labels.aiPreviewDemo}
          </div>
          <div className={`mt-2 text-sm leading-6 ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>
            {labels.takeRoomShot}
          </div>
        </div>
      </div>
    </section>

    {isOpen && (
      <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6">
        <div
          className={`max-h-[92vh] w-full overflow-auto rounded-t-[28px] border p-4 shadow-[0_30px_80px_rgba(0,0,0,0.28)] sm:max-w-3xl sm:rounded-[30px] sm:p-5 ${
            theme === 'dark'
              ? 'border-white/10 bg-[rgba(24,21,18,0.98)]'
              : 'border-white/60 bg-[rgba(255,251,245,0.98)]'
          }`}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className={`text-[11px] uppercase tracking-[0.24em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                {labels.roomPreview}
              </p>
              <h2 className={`mt-2 max-w-[12rem] font-display text-[24px] leading-none sm:max-w-none sm:text-3xl ${theme === 'dark' ? 'text-stone-100' : 'text-stone-900'}`}>
                {labels.aiPreviewDemo}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${
                theme === 'dark' ? 'border-white/10 bg-white/5 text-stone-100' : 'border-stone-200 bg-white text-stone-800'
              }`}
            >
              {labels.close}
            </button>
          </div>

          <div
            className={`overflow-hidden rounded-[26px] border p-3 ${
              theme === 'dark'
                ? 'border-white/10 bg-[linear-gradient(160deg,_rgba(42,37,33,0.95),_rgba(27,24,21,0.92))]'
                : 'border-stone-900/6 bg-[linear-gradient(160deg,_rgba(243,238,231,0.95),_rgba(232,224,214,0.92))]'
            }`}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22440%22 viewBox=%220 0 320 440%22%3E%3Cdefs%3E%3ClinearGradient id=%22g%22 x1=%220%22 x2=%221%22 y1=%220%22 y2=%221%22%3E%3Cstop stop-color=%22%23f6efe5%22/%3E%3Cstop offset=%221%22 stop-color=%22%23e0d4c4%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%22320%22 height=%22440%22 fill=%22url(%23g)%22/%3E%3C/svg%3E')] bg-cover bg-center">
              {generatedPreviewImage ? (
                <>
                  <img src={generatedPreviewImage} alt={`${product.name} preview`} className="absolute inset-0 h-full w-full object-cover" />
                  {previewProvider && previewProvider !== 'preserved' && (
                    <div className="absolute left-3 top-3 rounded-full bg-black/65 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                      Sanat Hali
                    </div>
                  )}
                </>
              ) : roomImage ? (
                <img src={roomImage} alt={`${product.name} room reference`} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className={`absolute inset-0 flex items-center justify-center px-6 text-center text-sm ${theme === 'dark' ? 'text-stone-300' : 'text-stone-500'}`}>
                  {labels.roomUploadHint}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label
              className={`flex cursor-pointer items-center justify-center rounded-[22px] border border-dashed px-4 py-4 text-sm font-semibold transition ${
                theme === 'dark'
                  ? 'border-white/20 bg-white/5 text-stone-200 hover:border-white/30 hover:text-white'
                  : 'border-stone-300 bg-white/70 text-stone-700 hover:border-stone-500 hover:text-stone-900'
              }`}
            >
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={onUpload} />
              {labels.uploadRoomCta}
            </label>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onModeChange('center')}
              className={`rounded-[22px] border px-4 py-4 text-left transition ${
                roomPlacementMode === 'center'
                  ? theme === 'dark'
                    ? 'border-amber-200/60 bg-amber-100 text-stone-900'
                    : 'border-stone-900 bg-stone-900 text-white'
                  : theme === 'dark'
                    ? 'border-white/10 bg-white/5 text-stone-200'
                    : 'border-stone-200 bg-white/70 text-stone-700'
              }`}
            >
              <div className="text-base font-semibold">{labels.centerPlacement}</div>
              <div className="mt-1 text-sm opacity-80">{labels.centerPlacementHint}</div>
            </button>
            <button
              type="button"
              onClick={() => onModeChange('coverage')}
              className={`rounded-[22px] border px-4 py-4 text-left transition ${
                roomPlacementMode === 'coverage'
                  ? theme === 'dark'
                    ? 'border-amber-200/60 bg-amber-100 text-stone-900'
                    : 'border-stone-900 bg-stone-900 text-white'
                  : theme === 'dark'
                    ? 'border-white/10 bg-white/5 text-stone-200'
                    : 'border-stone-200 bg-white/70 text-stone-700'
              }`}
            >
              <div className="text-base font-semibold">{labels.fullCoverage}</div>
              <div className="mt-1 text-sm opacity-80">{labels.fullCoverageHint}</div>
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className={`block rounded-[22px] border px-4 py-4 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-stone-200 bg-white/70'}`}>
              <div className={`text-[11px] uppercase tracking-[0.22em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>{labels.roomWidth}</div>
              <input
                value={roomDimensions.width}
                onChange={(event) => onDimensionsChange((current) => ({ ...current, width: event.target.value }))}
                className={`mt-2 w-full bg-transparent text-2xl outline-none ${theme === 'dark' ? 'text-stone-100' : 'text-stone-900'}`}
              />
            </label>
            <label className={`block rounded-[22px] border px-4 py-4 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-stone-200 bg-white/70'}`}>
              <div className={`text-[11px] uppercase tracking-[0.22em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>{labels.roomHeight}</div>
              <input
                value={roomDimensions.height}
                onChange={(event) => onDimensionsChange((current) => ({ ...current, height: event.target.value }))}
                className={`mt-2 w-full bg-transparent text-2xl outline-none ${theme === 'dark' ? 'text-stone-100' : 'text-stone-900'}`}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={onApply}
            disabled={isGenerating}
            className={`mt-4 w-full rounded-[22px] px-5 py-4 text-sm font-semibold shadow-[0_18px_30px_rgba(28,25,23,0.18)] transition disabled:cursor-not-allowed disabled:opacity-60 ${
              theme === 'dark'
                ? 'bg-amber-100 text-stone-900 hover:bg-amber-50'
                : 'border border-stone-900 bg-stone-900 text-white hover:bg-stone-800'
            }`}
          >
            {isGenerating ? labels.generatingPreview : labels.applyPreview}
          </button>

          {isGenerating && (
            <div className={`mt-3 text-center text-sm ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>
              {labels.estimatedWait}
            </div>
          )}

          {previewError && (
            <div className="mt-4 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {previewError}
            </div>
          )}
        </div>
      </div>
    )}
  </>
);

export default RoomPreviewPanel;
