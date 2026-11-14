import React, { useState, useEffect } from 'react';
import { Artifact } from '../types/space';
import {
  X,
  Volume2,
  VolumeX,
  BookOpen,
  Sparkles,
  Compass,
  Layers,
  ChevronRight,
  ChevronLeft,
  Cpu,
  Clock,
  MapPin,
  Wrench,
  Play,
  ExternalLink,
  Quote,
} from 'lucide-react';
import { useNASAVoice } from '../hooks/useNASAVoice';

interface StoryDrawerProps {
  artifact: Artifact | null;
  onClose: () => void;
  onNextArtifact: () => void;
  onPrevArtifact: () => void;
  onInspectModel?: (artifact: Artifact) => void;
}

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1) || null;
    }
    return parsed.searchParams.get('v');
  } catch {
    return null;
  }
}

export const StoryDrawer: React.FC<StoryDrawerProps> = ({
  artifact,
  onClose,
  onNextArtifact,
  onPrevArtifact,
  onInspectModel,
}) => {
  if (!artifact) return null;

  const [showVideoEmbed, setShowVideoEmbed] = useState(false);

  const nasaVoice = useNASAVoice({
    defaultPitch: artifact.id === 'spirit-and-opportunity' ? 1.02 : 0.95,
    defaultRate: 0.95,
    defaultFilterEnabled: true,
  });

  const narrationText = `${artifact.name}. ${artifact.firstPersonMonologue}`;
  const youtubeId = artifact.youtubeUrl ? extractYouTubeId(artifact.youtubeUrl) : null;

  // Reset video embed & stop audio when switching artifacts
  useEffect(() => {
    setShowVideoEmbed(false);
    return () => {
      nasaVoice.stop();
    };
  }, [artifact.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        nasaVoice.stop();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-[#08090d] text-zinc-100 flex flex-col animate-in fade-in duration-200 overflow-hidden font-sans">
      {/* Header */}
      <header className="px-3 sm:px-6 py-3 border-b border-white/10 bg-[#14161c] flex items-center justify-between gap-2 sm:gap-4 shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={() => {
              nasaVoice.stop();
              onClose();
            }}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors shrink-0"
            title="Return to 3D View (Esc)"
            aria-label="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-mono tabular-nums font-semibold text-blue-400">
                #{artifact.artifactNumber}
              </span>
              <h2 className="text-base sm:text-xl font-bold text-white tracking-tight truncate">
                {artifact.name}
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-mono tabular-nums truncate">
              {artifact.agency} · {artifact.year} · {artifact.categoryLabel}
            </p>
          </div>
        </div>

        {/* Right Actions: 3D Model Inspector + Prev/Next */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {onInspectModel && (
            <button
              onClick={() => onInspectModel(artifact)}
              className="min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
              title="Inspect 3D CAD Model"
            >
              <Cpu className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">3D Model</span>
            </button>
          )}

          <div className="flex items-center bg-[#0d0f14] border border-white/10 p-0.5 rounded-lg">
            <button
              onClick={onPrevArtifact}
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-md hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
              title="Previous Artifact"
              aria-label="Previous Artifact"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onNextArtifact}
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-md hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
              title="Next Artifact"
              aria-label="Next Artifact"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6 pb-8">
          {/* 1. First-Person Storytelling Monologue + Audio & YouTube Controls */}
          <section className="bg-[#14161c] rounded-2xl p-5 sm:p-7 border border-white/10 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-400">
                  <Quote className="w-3.5 h-3.5" />
                  <span>First-Person Mission Chronicle</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {artifact.story.headline}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    if (nasaVoice.isSpeaking) {
                      nasaVoice.stop();
                    } else {
                      nasaVoice.speakMissionLog(narrationText, nasaVoice.filterEnabled);
                    }
                  }}
                  className="min-h-[40px] flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 transition-colors"
                >
                  {nasaVoice.isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4 text-rose-400" />
                      <span className="text-rose-200">Stop Narration</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-blue-400" />
                      <span>Listen to Story</span>
                    </>
                  )}
                </button>

                {artifact.youtubeUrl && (
                  <>
                    {youtubeId && (
                      <button
                        onClick={() => setShowVideoEmbed((prev) => !prev)}
                        className="min-h-[40px] flex items-center gap-2 px-4 py-2 rounded-lg bg-[#e03a3e] hover:bg-[#c82d31] text-white text-xs font-semibold transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{showVideoEmbed ? 'Hide Video' : 'Watch Mission Video'}</span>
                      </button>
                    )}

                    <a
                      href={artifact.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-200 text-xs font-medium border border-white/10 transition-colors"
                    >
                      <span>YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Embedded YouTube Player (when toggled) */}
            {showVideoEmbed && youtubeId && (
              <div className="rounded-xl overflow-hidden border border-white/15 bg-black aspect-video w-full">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                  title={`${artifact.name} Mission Video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Verbatim First-Person Monologue */}
            <blockquote className="text-base sm:text-lg text-zinc-100 leading-relaxed border-l-2 border-blue-400 pl-4 sm:pl-5 py-1">
              "{artifact.firstPersonMonologue}"
            </blockquote>

            {/* Storytelling Hook */}
            <div className="pt-2 border-t border-white/10 text-sm text-zinc-300 leading-relaxed">
              <span className="font-mono text-[11px] uppercase tracking-wider text-amber-400 block mb-1">
                Historical Context
              </span>
              {artifact.storytellingHook}
            </div>
          </section>

          {/* 2. Mission Timeline & Coordinates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Timeline */}
            <section className="bg-[#14161c] rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-400">
                <Clock className="w-4 h-4" />
                <span>Mission Timeline</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono tabular-nums border-b border-white/10 pb-3">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">Launched</span>
                  <span className="text-white font-medium">{artifact.timeline.launched}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">Landed</span>
                  <span className="text-white font-medium">
                    {artifact.timeline.landed || 'Orbital / Flyby'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">Ended</span>
                  <span className="text-white font-medium">
                    {artifact.timeline.ended || 'Ongoing'}
                  </span>
                </div>
              </div>

              <p className="text-xs font-mono text-zinc-300 leading-relaxed">
                {artifact.timeline.summary}
              </p>

              <div className="pt-2 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                  Planned vs. Actual Longevity
                </span>
                <p className="text-sm text-zinc-200 leading-relaxed">
                  {artifact.plannedVsActual}
                </p>
              </div>
            </section>

            {/* Location & Coordinates */}
            <section className="bg-[#14161c] rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
                <MapPin className="w-4 h-4" />
                <span>Location & Coordinates</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Site / Trajectory
                </span>
                <p className="text-sm font-medium text-white leading-relaxed">
                  {artifact.locationName}
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Coordinates
                </span>
                <p className="text-xs font-mono tabular-nums text-emerald-300 leading-relaxed">
                  {artifact.coordinates.display}
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Mass / Dimensions / Power
                </span>
                <p className="text-sm text-zinc-200 leading-relaxed">{artifact.specs}</p>
              </div>
            </section>
          </div>

          {/* 3. Key Instruments & Scientific Legacy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Instruments */}
            <section className="bg-[#14161c] rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
                <Wrench className="w-4 h-4" />
                <span>Key Instruments</span>
              </div>

              <ul className="space-y-2">
                {artifact.instruments.map((inst, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-200">
                    <span className="font-mono text-xs text-zinc-500 mt-0.5 tabular-nums">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Scientific Legacy */}
            <section className="bg-[#14161c] rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-400">
                <Sparkles className="w-4 h-4" />
                <span>Scientific Legacy</span>
              </div>

              <p className="text-sm text-zinc-200 leading-relaxed">
                {artifact.scientificDiscoveries}
              </p>

              <div className="pt-2 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                  Why It Remained Behind
                </span>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {artifact.story.whyLeftBehind}
                </p>
              </div>
            </section>
          </div>

          {/* 4. Official Source Footer */}
          {artifact.officialSource && (
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#14161c] rounded-xl px-5 py-3.5 border border-white/10 text-xs">
              <div className="flex items-center gap-2 text-zinc-400 font-mono">
                <BookOpen className="w-4 h-4 text-zinc-400" />
                <span>
                  {artifact.catalogRef ? `${artifact.catalogRef} · ` : ''}Official NASA Archive
                </span>
              </div>
              <a
                href={artifact.officialSource}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4"
              >
                <span>View NASA Mission Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
