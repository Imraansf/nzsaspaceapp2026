import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Artifact, CelestialBody, PlanetaryLandmark } from './types/space';
import {
  getArtifacts,
  getPlanetaryLandmarks,
  getArtifactById,
  getArtifactColor,
} from './utils/space-data';
import { CelestialGlobe } from './components/CelestialGlobe';
import { CesiumGlobeViewer } from './components/CesiumGlobeViewer';
import { DeepSpaceExplorer } from './components/DeepSpaceExplorer';
import { StoryDrawer } from './components/StoryDrawer';
import { LandingIntro } from './components/LandingIntro';
import {
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  X,
  Menu,
  Home,
  Footprints,
} from 'lucide-react';
import { ModelInspectorModal } from './components/ModelInspectorModal';
import { TranquilitySiteModal } from './components/TranquilitySiteModal';
import {
  toggleAudioMute,
  playTelemetryBeep,
  playRadarPing,
  playSuccessChime,
} from './utils/audio';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [currentBody, setCurrentBody] = useState<CelestialBody>('moon');
  const [engineMode] = useState<'cesium' | 'globe'>('cesium');
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [showSmallPopup, setShowSmallPopup] = useState(false);
  const [selectedLandmark, setSelectedLandmark] = useState<PlanetaryLandmark | null>(null);
  const [showLandmarks] = useState(true);
  const [inspectingArtifact, setInspectingArtifact] = useState<Artifact | null>(null);
  const [isTimelineCollapsed, setIsTimelineCollapsed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSiteExplorerOpen, setIsSiteExplorerOpen] = useState(false);

  const artifacts = useMemo(() => getArtifacts(currentBody), [currentBody]);
  const landmarks = useMemo(() => getPlanetaryLandmarks(currentBody), [currentBody]);

  // Zoom onto object first; display small pop-up on the right hand side after zoom animation completes (2.0s duration)
  useEffect(() => {
    if (selectedArtifact && !isDossierOpen) {
      setShowSmallPopup(false);
      const timer = setTimeout(() => {
        setShowSmallPopup(true);
      }, 2100);
      return () => clearTimeout(timer);
    } else {
      setShowSmallPopup(false);
    }
  }, [selectedArtifact?.id, isDossierOpen]);

  const filteredArtifacts = artifacts;

  const handleToggleMute = useCallback(() => {
    const nextMuted = toggleAudioMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      playSuccessChime();
    }
  }, []);

  const handleSelectArtifact = useCallback((artifact: Artifact | null) => {
    playRadarPing();
    setSelectedArtifact(artifact);
    setIsDossierOpen(false);
    setSelectedLandmark(null);
  }, []);

  const handleOpenCadInspector = useCallback((artifact: Artifact) => {
    setInspectingArtifact(artifact);
  }, []);

  const handleSelectLandmark = useCallback((landmark: PlanetaryLandmark) => {
    playRadarPing();
    setSelectedLandmark(landmark);
  }, []);

  const handleNextArtifact = useCallback(() => {
    if (!selectedArtifact || artifacts.length === 0) return;
    const idx = artifacts.findIndex((a) => a.id === selectedArtifact.id);
    const nextIdx = (idx + 1) % artifacts.length;
    handleSelectArtifact(artifacts[nextIdx]);
  }, [selectedArtifact, artifacts, handleSelectArtifact]);

  const handlePrevArtifact = useCallback(() => {
    if (!selectedArtifact || artifacts.length === 0) return;
    const idx = artifacts.findIndex((a) => a.id === selectedArtifact.id);
    const prevIdx = (idx - 1 + artifacts.length) % artifacts.length;
    handleSelectArtifact(artifacts[prevIdx]);
  }, [selectedArtifact, artifacts, handleSelectArtifact]);

  const handleSelectZoneFromLanding = useCallback((zone: CelestialBody) => {
    setCurrentBody(zone);
    setSelectedArtifact(null);
    setSelectedLandmark(null);
    setIsDossierOpen(false);
    setShowLanding(false);
  }, []);

  const isOverlayOpen = Boolean(
    (selectedArtifact && isDossierOpen) ||
    Boolean(inspectingArtifact) ||
    isSiteExplorerOpen
  );

  if (showLanding) {
    return <LandingIntro onSelectZone={handleSelectZoneFromLanding} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050608] text-zinc-100 font-sans select-none">
      {/* 1. Main 3D Viewport (hidden when full-screen menus are open to conserve GPU/WebGL context) */}
      <div className={`absolute inset-0 z-0 ${isOverlayOpen ? 'hidden pointer-events-none' : 'block'}`}>
        <ViewportSection
          currentBody={currentBody}
          engineMode={engineMode}
          filteredArtifacts={filteredArtifacts}
          selectedArtifact={selectedArtifact}
          handleSelectArtifact={handleSelectArtifact}
          landmarks={landmarks}
          showLandmarks={showLandmarks}
          handleSelectLandmark={handleSelectLandmark}
          selectedLandmark={selectedLandmark}
        />
      </div>

      {/* 2. Floating Top-Left Navigation Menu (Returns to Main Menu to select Moon / Mars / Deep Space) */}
      <nav
        aria-label="Main Navigation Menu"
        className="absolute top-3 left-2 sm:top-4 sm:left-4 z-40 flex flex-col items-start gap-2"
      >
        <button
          onClick={() => {
            playTelemetryBeep(420);
            setIsMenuOpen((prev) => !prev);
          }}
          className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#14161c]/95 hover:bg-[#1c1f28] border border-white/15 text-zinc-100 text-xs font-mono font-semibold flex items-center gap-2 shadow-xl backdrop-blur-xl transition-colors"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="w-4 h-4 text-zinc-300" /> : <Menu className="w-4 h-4 text-[#e03a3e]" />}
          <span>Menu</span>
          <span className="text-zinc-400 font-normal">
            · {currentBody === 'deep_space' ? 'Deep Space' : currentBody === 'mars' ? 'Mars' : 'Moon'}
          </span>
        </button>

        {isMenuOpen && (
          <div className="w-60 bg-[#14161c]/95 border border-white/15 rounded-xl p-1.5 shadow-2xl backdrop-blur-xl flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-150">
            <button
              onClick={() => {
                playTelemetryBeep(380);
                setIsMenuOpen(false);
                setSelectedArtifact(null);
                setSelectedLandmark(null);
                setIsDossierOpen(false);
                setShowLanding(true);
              }}
              className="w-full min-h-[40px] px-3 py-2 rounded-lg text-left text-xs font-medium text-white hover:bg-white/10 flex items-center gap-2.5 transition-colors"
            >
              <Home className="w-4 h-4 text-[#e03a3e] shrink-0" />
              <div>
                <div className="font-semibold">Back to Main Menu</div>
                <div className="text-[10px] text-zinc-400 font-mono">
                  Choose Moon, Mars, or Deep Space
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                handleToggleMute();
              }}
              className="w-full min-h-[40px] px-3 py-2 rounded-lg text-left text-xs font-medium text-zinc-200 hover:bg-white/10 flex items-center gap-2.5 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-zinc-400 shrink-0" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{isMuted ? 'Unmute Audio' : 'Mute Audio'}</span>
            </button>
          </div>
        )}
      </nav>

      {/* 3. Floating Planetary Landmark Card: Minimalist NASA Spec Sheet */}
      {selectedLandmark && currentBody !== 'deep_space' && (
        <div className="absolute top-16 right-3 sm:right-4 left-3 sm:left-auto w-auto sm:w-64 max-w-[260px] z-30 bg-[#1e1f20]/95 border border-white/10 rounded-xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5">
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest font-mono text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {selectedLandmark.type === 'volcano'
                ? 'Shield Volcano'
                : selectedLandmark.type === 'canyon'
                ? 'Tectonic Canyon'
                : selectedLandmark.type === 'crater'
                ? 'Impact Crater'
                : selectedLandmark.type === 'mare'
                ? 'Basaltic Plain'
                : 'Landmark'}
              {selectedLandmark.diameterKm ? ` • ${selectedLandmark.diameterKm} km` : ''}
            </div>
            <button
              onClick={() => setSelectedLandmark(null)}
              className="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              aria-label="Close landmark info"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-2 space-y-0.5">
            <h3 className="text-sm font-bold tracking-tight text-white truncate">
              {selectedLandmark.name}
            </h3>
            <div className="text-[10px] font-mono text-zinc-400 truncate">
              {selectedLandmark.coordinates.lat >= 0
                ? `${selectedLandmark.coordinates.lat.toFixed(1)}°N`
                : `${Math.abs(selectedLandmark.coordinates.lat).toFixed(1)}°S`}
              ,{' '}
              {selectedLandmark.coordinates.lon >= 0
                ? `${selectedLandmark.coordinates.lon.toFixed(1)}°E`
                : `${Math.abs(selectedLandmark.coordinates.lon).toFixed(1)}°W`}
            </div>
          </div>

          <p className="text-xs text-zinc-300 mt-2 leading-relaxed line-clamp-2">
            {selectedLandmark.description}
          </p>

          {selectedLandmark.associatedArtifactId && (
            <button
              onClick={() => {
                const artifact = getArtifactById(
                  selectedLandmark.associatedArtifactId!
                );
                if (artifact) {
                  handleSelectArtifact(artifact);
                }
              }}
              className="mt-2.5 w-full py-1.5 px-3 rounded-lg bg-white text-zinc-950 font-semibold text-xs flex items-center justify-center gap-1 transition-all hover:bg-zinc-100 shadow-md"
            >
              <span>View Hardware</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 4. Minimalist Bottom Carousel / Equipment Timeline */}
      {currentBody !== 'deep_space' && (
        <div
          className="absolute bottom-3 sm:bottom-4 inset-x-0 z-20 flex flex-col items-center gap-2 sm:gap-3 px-2 sm:px-4 pointer-events-none transition-all duration-500"
        >
          {/* Collapse / Expand Toggle Button */}
          <button
            onClick={() => {
              playTelemetryBeep(400);
              setIsTimelineCollapsed(!isTimelineCollapsed);
            }}
            className="pointer-events-auto px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#1e1f20]/95 border border-white/10 text-[11px] sm:text-xs font-semibold text-zinc-300 hover:text-white backdrop-blur-xl flex items-center gap-1.5 sm:gap-2 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          >
            {isTimelineCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                <span>Show Mission Timeline</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
                <span>Hide Timeline</span>
              </>
            )}
          </button>

          {/* Timeline Carousel Strip: Simplistic & Mobile Friendly */}
          {!isTimelineCollapsed && (
            <div className="pointer-events-auto w-full max-w-3xl bg-[#08090d]/80 border border-white/5 rounded-xl sm:rounded-2xl p-1 sm:p-1.5 backdrop-blur-xl shadow-2xl flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory">
              {filteredArtifacts.map((artifact: Artifact) => {
                const isSelected = selectedArtifact?.id === artifact.id;
                const artifactColor = getArtifactColor(artifact);
                return (
                  <button
                    key={artifact.id}
                    onClick={() => handleSelectArtifact(artifact)}
                    className={`flex-shrink-0 snap-center min-w-[105px] sm:min-w-[160px] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-zinc-800 border-white/20 text-white shadow-lg scale-105'
                        : 'bg-[#18191a]/80 border-transparent text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider mb-0.5 flex items-center gap-1 sm:gap-1.5 font-mono tabular-nums">
                      <span style={{ color: isSelected ? artifactColor : undefined }} className={!isSelected ? 'text-zinc-500' : ''}>
                        {artifact.year}
                      </span>
                      {isSelected && <span style={{ backgroundColor: artifactColor }} className="w-1 h-1 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]" />}
                    </div>
                    <h4 className={`text-[11px] sm:text-xs font-medium truncate ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                      {artifact.moniker}
                    </h4>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. Small Target Popup (Appears after zoom) */}
      {selectedArtifact && !isDossierOpen && showSmallPopup && (
        <div className="absolute top-16 right-3 sm:right-4 left-3 sm:left-auto w-auto sm:w-64 max-w-[260px] z-30 bg-[#1e1f20]/95 border border-white/10 rounded-xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5">
            <div 
              style={{ color: getArtifactColor(selectedArtifact) }}
              className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest font-mono"
            >
              <span 
                style={{ backgroundColor: getArtifactColor(selectedArtifact) }}
                className="w-1.5 h-1.5 rounded-full animate-pulse" 
              />
              Target Acquired
            </div>
            <button
              onClick={() => setSelectedArtifact(null)}
              className="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              aria-label="Close target info"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-2 space-y-0.5">
            <h3 style={{ color: getArtifactColor(selectedArtifact) }} className="text-sm font-bold tracking-tight truncate">
              {selectedArtifact.name}
            </h3>
            <div className="text-[10px] font-mono text-zinc-400 truncate">
              {selectedArtifact.agency} • {selectedArtifact.year} • {selectedArtifact.locationName}
            </div>
          </div>

          <div className="mt-2.5 flex flex-col gap-2">
            <button
              onClick={() => {
                playTelemetryBeep(650);
                setIsDossierOpen(true);
              }}
              className="w-full py-1.5 px-3 rounded-lg bg-white text-zinc-950 font-semibold text-xs flex items-center justify-center gap-1 transition-all hover:bg-zinc-100 shadow-md"
            >
              <span>Get details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {selectedArtifact.id === 'apollo-11-eagle-easep' && (
              <button
                onClick={() => {
                  playSuccessChime();
                  setIsSiteExplorerOpen(true);
                }}
                className="w-full py-1.5 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>Land on site</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 6. Full-Screen NASA Mission Dossier Window */}
      {selectedArtifact && isDossierOpen && (
        <StoryDrawer
          artifact={selectedArtifact}
          onClose={() => setIsDossierOpen(false)}
          onNextArtifact={handleNextArtifact}
          onPrevArtifact={handlePrevArtifact}
          onInspectModel={handleOpenCadInspector}
          onLaunchSite={() => {
            playSuccessChime();
            setIsSiteExplorerOpen(true);
          }}
        />
      )}

      {/* 7. Interactive 3D CAD Model Inspector Modal */}
      {inspectingArtifact && (
        <ModelInspectorModal
          artifact={inspectingArtifact}
          onClose={() => setInspectingArtifact(null)}
        />
      )}

      {/* 8. Tranquility Base: Walk the Site Experience */}
      {isSiteExplorerOpen && (
        <TranquilitySiteModal onClose={() => setIsSiteExplorerOpen(false)} />
      )}
    </div>
  );
}

// Sub-component to isolate 3D viewport rendering and prevent refreshes on UI toggle
const ViewportSection = React.memo(({
  currentBody,
  engineMode,
  filteredArtifacts,
  selectedArtifact,
  handleSelectArtifact,
  landmarks,
  showLandmarks,
  handleSelectLandmark,
  selectedLandmark
}: any) => {
  return (
    <>
      {currentBody === 'deep_space' ? (
        <DeepSpaceExplorer
          key="deep_space"
          artifacts={filteredArtifacts}
          selectedArtifact={selectedArtifact}
          onSelectArtifact={handleSelectArtifact}
        />
      ) : engineMode === 'cesium' ? (
        <CesiumGlobeViewer
          key={currentBody}
          selectedBody={currentBody === 'mars' ? 'MARS' : 'MOON'}
          relics={filteredArtifacts}
          selectedRelicId={selectedArtifact?.id}
          onSelectRelic={(relic: any) => {
            const fullArtifact = filteredArtifacts.find((a: Artifact) => a.id === relic.id);
            if (fullArtifact) {
              handleSelectArtifact(fullArtifact);
            }
          }}
          landmarks={landmarks}
          showLandmarks={showLandmarks}
          onSelectLandmark={handleSelectLandmark}
          selectedLandmark={selectedLandmark}
        />
      ) : (
        <CelestialGlobe
          key={currentBody}
          body={currentBody}
          artifacts={filteredArtifacts}
          selectedArtifact={selectedArtifact}
          onSelectArtifact={handleSelectArtifact}
          landmarks={landmarks}
          showLandmarks={showLandmarks}
          onSelectLandmark={handleSelectLandmark}
          selectedLandmark={selectedLandmark}
        />
      )}
    </>
  );
});
