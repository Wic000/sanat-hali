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
  onDimensionsChange: (dimensions: RoomDimensions) => void;
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
    previewReadyStatus: string;
  };
  theme: ThemeMode;
}

const RoomPreviewPanel: React.FC<RoomPreviewPanelProps> = ({ theme, labels }) => (
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
        <h2 className={`mt-2 font-display text-[24px] leading-none sm:text-3xl ${theme === 'dark' ? 'text-stone-100' : 'text-stone-900'}`}>
          {labels.aiBlock}
        </h2>
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

    <div
      className={`mt-5 rounded-[26px] border p-4 ${
        theme === 'dark'
          ? 'border-white/10 bg-[linear-gradient(160deg,_rgba(42,37,33,0.68),_rgba(27,24,21,0.52))]'
          : 'border-white/80 bg-[rgba(255,255,255,0.54)]'
      }`}
    >
      <div className={`text-[11px] uppercase tracking-[0.22em] ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
        {labels.aiPreviewDemo}
      </div>
      <p className={`mt-3 text-sm leading-6 ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>
        {labels.aiBlockHint}
      </p>
      <div
        className={`mt-4 rounded-[22px] border border-dashed px-4 py-4 text-sm font-semibold ${
          theme === 'dark'
            ? 'border-white/10 bg-white/5 text-stone-400'
            : 'border-stone-300 bg-white/70 text-stone-500'
        }`}
      >
        {labels.openPreview}
      </div>
    </div>
  </section>
);

export default RoomPreviewPanel;
