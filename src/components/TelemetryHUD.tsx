import React, { useState } from 'react';
import {
  Compass,
  RotateCcw,
  Globe,
  Crosshair,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  ChevronUp,
  Activity,
} from 'lucide-react';
import { Relic } from './CesiumGlobeViewer';

interface TelemetryHUDProps {
  selectedBody: 'MOON' | 'MARS' | 'moon' | 'mars';
  activeRelic: Relic | null;
  crosshairCoords: { lat: number; lon: number } | null;
  cameraHeightKm: number;
  activePreset: 'orbital' | 'north' | 'equator' | 'target';
  onFlyToPreset: (preset: 'orbital' | 'north' | 'equator' | 'target') => void;
  onZoom: (direction: 'in' | 'out') => void;
  onSelectRelic?: (relic: Relic) => void;
  className?: string;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({
  selectedBody,
  activeRelic,
  crosshairCoords,
  cameraHeightKm,
  activePreset,
  onFlyToPreset,
  onZoom,
  className = '',
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const normalizedBody = selectedBody.toUpperCase();

  const coordsString = crosshairCoords
    ? `${crosshairCoords.lat >= 0 ? `${crosshairCoords.lat.toFixed(1)}°N` : `${Math.abs(crosshairCoords.lat).toFixed(1)}°S`}, ${crosshairCoords.lon >= 0 ? `${crosshairCoords.lon.toFixed(1)}°E` : `${Math.abs(crosshairCoords.lon).toFixed(1)}°W`}`
    : activeRelic && activeRelic.coordinates
    ? `${activeRelic.coordinates.lat >= 0 ? `${activeRelic.coordinates.lat.toFixed(1)}°N` : `${Math.abs(activeRelic.coordinates.lat).toFixed(1)}°S`}, ${activeRelic.coordinates.lon >= 0 ? `${activeRelic.coordinates.lon.toFixed(1)}°E` : `${Math.abs(activeRelic.coordinates.lon).toFixed(1)}°W`}`
    : '28.5°N, 80.6°W';

  const altitudeString =
    cameraHeightKm > 0
      ? `${cameraHeightKm >= 1000 ? (cameraHeightKm / 1000).toFixed(1) + 'k' : cameraHeightKm.toLocaleString()} km`
      : 'Orbital';

  return (
    <div
      className={`pointer-events-auto select-none touch-manipulation transition-all duration-300 ${
        isMinimized ? 'w-auto' : 'w-56 sm:w-60'
      } ${className}`}
    >
      {/* 1. Minimized Mode */}
      {isMinimized ? (
        <div className="flex items-center gap-1 bg-[#1e1f20]/95 border border-white/10 rounded-full p-0.5 shadow-xl backdrop-blur-xl">
          <button
            onClick={() => setIsMinimized(false)}
            className="px-2.5 py-1 flex items-center gap-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-200 text-[10px] font-mono border border-white/10 transition-colors"
            title="Expand Telemetry HUD"
          >
            <Activity className="w-3 h-3 text-blue-400 animate-pulse" />
            <span className="font-bold tracking-wider uppercase">
              HUD • {altitudeString}
            </span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>
        </div>
      ) : (
        /* 2. Expanded Mode: Ultra-Compact & Minimalist HUD */
        <div className="bg-[#1e1f20]/95 border border-white/10 rounded-xl p-2 shadow-2xl backdrop-blur-xl flex flex-col gap-1.5 text-zinc-100">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-1 border-b border-white/10">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[9px] font-mono uppercase tracking-widest text-white font-bold">
                NASA {normalizedBody}
              </span>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              title="Minimize Telemetry HUD"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Compact Telemetry Metrics Line */}
          <div className="bg-black/30 rounded-lg px-2 py-1 border border-white/5 flex items-center justify-between text-[9px] font-mono">
            <span className="text-zinc-400 truncate">{coordsString}</span>
            <span className="text-blue-400 font-semibold shrink-0 ml-1">{altitudeString}</span>
          </div>

          {/* Camera View Presets */}
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => onFlyToPreset('orbital')}
              className={`py-1 px-1.5 rounded-lg text-[9px] font-mono transition-all flex items-center justify-center gap-1 border ${
                activePreset === 'orbital'
                  ? 'bg-white text-zinc-950 font-bold border-white shadow-sm'
                  : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
              }`}
              title="Orbital Overview"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Orbit</span>
            </button>

            <button
              onClick={() => onFlyToPreset('north')}
              className={`py-1 px-1.5 rounded-lg text-[9px] font-mono transition-all flex items-center justify-center gap-1 border ${
                activePreset === 'north'
                  ? 'bg-white text-zinc-950 font-bold border-white shadow-sm'
                  : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
              }`}
              title="North Pole"
            >
              <Compass className="w-2.5 h-2.5" />
              <span>North</span>
            </button>

            <button
              onClick={() => onFlyToPreset('equator')}
              className={`py-1 px-1.5 rounded-lg text-[9px] font-mono transition-all flex items-center justify-center gap-1 border ${
                activePreset === 'equator'
                  ? 'bg-white text-zinc-950 font-bold border-white shadow-sm'
                  : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
              }`}
              title="Equator"
            >
              <Globe className="w-2.5 h-2.5" />
              <span>Equator</span>
            </button>
          </div>

          {/* Target Focus & Zoom Row */}
          <div className="flex items-center gap-1 pt-1 border-t border-white/5">
            {activeRelic && (
              <button
                onClick={() => onFlyToPreset('target')}
                className={`flex-1 py-1 px-2 rounded-lg text-[9px] font-mono font-semibold transition-all flex items-center justify-center gap-1 ${
                  activePreset === 'target'
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/10'
                }`}
              >
                <Crosshair className="w-3 h-3" />
                <span>Focus</span>
              </button>
            )}

            <div className="flex items-center gap-1 shrink-0 ml-auto">
              <button
                onClick={() => onZoom('in')}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 transition-all border border-white/5"
                title="Zoom In"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
              <button
                onClick={() => onZoom('out')}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 transition-all border border-white/5"
                title="Zoom Out"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
