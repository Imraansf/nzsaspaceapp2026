import React, { useEffect, useRef } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { playTelemetryBeep } from '../utils/audio';

interface TranquilitySiteModalProps {
  onClose: () => void;
}

export const TranquilitySiteModal: React.FC<TranquilitySiteModalProps> = ({ onClose }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playTelemetryBeep(420);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden animate-in fade-in duration-200">
      {/* Top-Right Return Control (placed away from Tranquility Base top-left HUD & bottom-right info panel) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => {
            playTelemetryBeep(420);
            onClose();
          }}
          className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#08080a]/90 hover:bg-[#18181b] border border-amber-400/35 text-amber-200 hover:text-white text-xs font-mono font-semibold flex items-center gap-2 shadow-2xl backdrop-blur-md transition-colors"
          title="Return to Lunar Orbit View"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Return to Orbit</span>
          <X className="w-3.5 h-3.5 text-zinc-400 ml-0.5" />
        </button>
      </div>

      {/* Standalone Tranquility Base: Walk the Site Experience */}
      <iframe
        ref={iframeRef}
        src="/tranquility-base.html"
        title="Tranquility Base: Walk the Site"
        className="w-full h-full border-0 block bg-black"
        allow="fullscreen; pointer-lock"
        onLoad={() => {
          try {
            iframeRef.current?.focus();
          } catch {
            // Ignore focus restrictions if any
          }
        }}
      />
    </div>
  );
};
