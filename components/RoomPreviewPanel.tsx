import React, { ChangeEvent } from 'react';
import { Product, RoomDimensions, RoomPlacementMode, ThemeMode } from '../types';

interface RoomPreviewPanelProps {
  product: Product;
  roomImage: string | null;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
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
    previewReadyStatus: string;
  };
  theme: ThemeMode;
}

const RoomPreviewPanel: React.FC<RoomPreviewPanelProps> = ({
  product,
  roomImage,
  isOpen,
  onOpen,
  onClose,
  onUpload,
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

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className={`rounded-[24px] border p-4 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/80 bg-white/42'}`}>
            <div className={`text-[11px] uppercase tracking-[0.22em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
              {labels.aiPreviewDemo}
            </div>
          <div className={`mt-2 text-sm leading-6 ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>
            {labels.takeRoomShot}
          </div>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className={`rounded-[22px] px-5 py-4 text-sm font-semibold shadow-[0_18px_30px_rgba(28,25,23,0.18)] transition ${
            theme === 'dark'
              ? 'bg-amber-100 text-stone-900 hover:bg-amber-50'
              : 'border border-white/85 bg-[rgba(255,255,255,0.7)] text-stone-900 hover:bg-[rgba(255,255,255,0.82)]'
          }`}
        >
          {labels.openPreview}
        </button>
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
                {labels.openPreview}
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
            <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22440%22 viewBox=%220 0 320 440%22%3E%3Cdefs%3E%3ClinearGradient id=%22g%22 x1=%220%22 x2=%221%22 y1=%220%22 y2=%221%22%3E%3Cstop stop-color=%22%23f6efe5%22/%3E%3Cstop offset=%221%22 stop-color=%22%23e0d4c4%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%22320%22 height=%22440%22 fill=%22url(%23g)%22/%3E%3Crect x=%2234%22 y=%2248%22 width=%22252%22 height=%22126%22 rx=%2222%22 fill=%22%23ffffff%22 fill-opacity=%220.45%22/%3E%3Crect x=%2256%22 y=%22238%22 width=%22212%22 height=%2290%22 rx=%2216%22 fill=%22%23d8c1a3%22 fill-opacity=%220.42%22/%3E%3Crect x=%2280%22 y=%22334%22 width=%22158%22 height=%2248%22 rx=%2214%22 fill=%22%23ece3d7%22 fill-opacity=%220.72%22/%3E%3C/svg%3E')] bg-cover bg-center">
              {roomImage ? (
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
        </div>
      </div>
    )}
  </>
);

export default RoomPreviewPanel;
