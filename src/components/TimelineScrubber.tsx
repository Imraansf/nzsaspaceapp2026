import React, { useRef, useEffect } from 'react';
import { Artifact } from '../types/space';
import { getArtifactColor } from '../utils/space-data';
import { ChevronUp, ChevronDown, Calendar, Sparkles } from 'lucide-react';

interface TimelineScrubberProps {
  artifacts: Artifact[];
  selectedArtifact: Artifact | null;
  onSelectArtifact: (artifact: Artifact) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
}

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  artifacts,
  selectedArtifact,
  onSelectArtifact,
  isCollapsed,
  onToggleCollapse,
  className = '',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll selected artifact into center view
  useEffect(() => {
    if (!selectedArtifact || isCollapsed || !scrollContainerRef.current) return;
    const selectedEl = scrollContainerRef.current.querySelector(
      `[data-relic-id="${selectedArtifact.id}"]`
    ) as HTMLElement | null;

    if (selectedEl) {
      selectedEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedArtifact?.id, isCollapsed]);

  // Sort artifacts chronologically
  const sortedArtifacts = [...artifacts].sort((a, b) => a.year - b.year);

  // Formatted 2-digit or 4-digit year for mobile tick display
  const getShortYear = (year: number) => {
    return `'${String(year).slice(-2)}`;
  };

  return (
    <div
      className={`pointer-events-none select-none touch-manipulation flex flex-col items-center gap-1.5 px-2 sm:px-4 transition-all duration-300 ${className}`}
    >
      {/* 1. Toggle Button (Minimum 44px touch target) */}
      <button
        onClick={onToggleCollapse}
        className="pointer-events-auto min-h-[44px] px-3.5 py-1.5 rounded-full bg-[#0b0e17]/95 border border-cyan-500/30 text-[10px] sm:text-xs font-mono font-semibold text-cyan-300 hover:text-white backdrop-blur-xl flex items-center gap-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] active:scale-95 transition-all"
        aria-label={isCollapsed ? 'Show Mission Timeline' : 'Hide Mission Timeline'}
      >
        {isCollapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Timeline • {sortedArtifacts.length} Missions</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            <span>Hide Timeline</span>
          </>
        )}
      </button>

      {/* 2. Timeline Carousel / Scrubber Strip */}
      {!isCollapsed && (
        <div className="pointer-events-auto w-full max-w-4xl bg-[#08090d]/90 border border-white/10 rounded-2xl p-1.5 backdrop-blur-xl shadow-2xl flex flex-col gap-1">
          {/* Mobile Single-Line Active Relic Label Overlay (< sm) */}
          <div className="sm:hidden flex items-center justify-between px-2 pt-0.5 text-[10px] font-mono text-zinc-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-cyan-400" />
              <span>CHRONOLOGICAL STREAM</span>
            </span>
            {selectedArtifact && (
              <span className="text-white font-bold truncate max-w-[160px]">
                {selectedArtifact.year} • {selectedArtifact.moniker}
              </span>
            )}
          </div>

          {/* Scroller Container */}
          <div
            ref={scrollContainerRef}
            className="w-full flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar momentum-scroll snap-x snap-mandatory py-0.5 px-0.5"
          >
            {sortedArtifacts.map((artifact) => {
              const isSelected = selectedArtifact?.id === artifact.id;
              const artifactColor = getArtifactColor(artifact);

              return (
                <button
                  key={artifact.id}
                  data-relic-id={artifact.id}
                  onClick={() => onSelectArtifact(artifact)}
                  className={`flex-shrink-0 snap-center transition-all duration-200 text-left touch-manipulation min-h-[44px] ${
                    /* Mobile: compact tick button; Desktop: expanded card */
                    isSelected
                      ? 'bg-zinc-800 border-cyan-400 text-white shadow-lg scale-102 border'
                      : 'bg-[#141721]/80 border border-white/5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  } rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 min-w-[72px] sm:min-w-[150px] max-w-[120px] sm:max-w-[180px]`}
                  aria-label={`Select ${artifact.name}`}
                >
                  {/* Mobile Compact View (< sm): Year + Mini Moniker */}
                  <div className="sm:hidden flex flex-col justify-center">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className="text-[11px] font-mono font-bold"
                        style={{ color: isSelected ? artifactColor : '#94a3b8' }}
                      >
                        {getShortYear(artifact.year)}
                      </span>
                      {isSelected && (
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ backgroundColor: artifactColor }}
                        />
                      )}
                    </div>
                    <span className="text-[10px] font-sans truncate text-zinc-300 leading-tight">
                      {artifact.moniker}
                    </span>
                  </div>

                  {/* Desktop Expanded View (sm:) */}
                  <div className="hidden sm:block">
                    <div className="text-[10px] font-mono uppercase tracking-wider mb-0.5 flex items-center justify-between">
                      <span
                        style={{ color: isSelected ? artifactColor : undefined }}
                        className={!isSelected ? 'text-zinc-500 font-bold' : 'font-bold'}
                      >
                        {artifact.year}
                      </span>
                      {isSelected && (
                        <span
                          style={{ backgroundColor: artifactColor }}
                          className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                        />
                      )}
                    </div>
                    <h4
                      className={`text-xs font-medium truncate ${
                        isSelected ? 'text-white font-semibold' : 'text-zinc-300'
                      }`}
                    >
                      {artifact.moniker}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
