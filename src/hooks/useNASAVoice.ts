import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseNASAVoiceOptions {
  defaultPitch?: number;
  defaultRate?: number;
  defaultVolume?: number;
  defaultFilterEnabled?: boolean;
}

export interface UseNASAVoiceReturn {
  speakMissionLog: (text: string, enableRadioFilter?: boolean) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  toggleMute: () => void;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void;
  isSpeaking: boolean;
  isPaused: boolean;
  isMuted: boolean;
  filterEnabled: boolean;
  setFilterEnabled: (enabled: boolean) => void;
  pitch: number;
  setPitch: (pitch: number) => void;
  rate: number;
  setRate: (rate: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
  analyserNode: AnalyserNode | null;
  audioContext: AudioContext | null;
  currentText: string | null;
}

/**
 * Generates an authentic WaveShaper distortion curve for subtle tape/tube warmth
 */
function makeDistortionCurve(amount = 20): Float32Array<ArrayBuffer> {
  const k = amount;
  const n_samples = 44100;
  const buffer = new ArrayBuffer(n_samples * 4);
  const curve = new Float32Array(buffer);
  const deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    // Classic soft-clipping sigmoid curve
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

export function useNASAVoice(options: UseNASAVoiceOptions = {}): UseNASAVoiceReturn {
  const {
    defaultPitch = 0.95,
    defaultRate = 0.95,
    defaultVolume = 1.0,
    defaultFilterEnabled = true,
  } = options;

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [filterEnabled, setFilterEnabled] = useState<boolean>(defaultFilterEnabled);
  const [pitch, setPitch] = useState<number>(defaultPitch);
  const [rate, setRate] = useState<number>(defaultRate);
  const [volume, setVolume] = useState<number>(defaultVolume);
  const [currentText, setCurrentText] = useState<string | null>(null);

  // Audio nodes and references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const carrierNoiseGainRef = useRef<GainNode | null>(null);
  const radioChainRef = useRef<{
    highpass: BiquadFilterNode;
    lowpass: BiquadFilterNode;
    bandboost: BiquadFilterNode;
    waveShaper: WaveShaperNode;
    outputGain: GainNode;
  } | null>(null);

  const animationFrameRef = useRef<number | null>(null);
  const speechIntervalRef = useRef<number | null>(null);

  // 1. Initialise Web Audio API context and Apollo radio filter processing graph
  const initAudioChain = useCallback(() => {
    if (typeof window === 'undefined') return null;

    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return null;
      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      // Master Analyser Node for visualizer
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // --- Apollo Mission Control Radio Processing Chain ---
      // 1. High-pass filter cuts off rumble below 300 Hz
      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 300;
      highpass.Q.value = 1.0;

      // 2. Low-pass filter cuts off high hiss above 4500 Hz (increased from 3000)
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 4500;
      lowpass.Q.value = 1.0;

      // 3. Bell-system midrange presence peak (~1200 Hz)
      const bandboost = ctx.createBiquadFilter();
      bandboost.type = 'peaking';
      bandboost.frequency.value = 1250;
      bandboost.gain.value = 2.5; // reduced from 3.5
      bandboost.Q.value = 1.2;

      // 4. Subtle distortion / tape saturation via WaveShaper
      const waveShaper = ctx.createWaveShaper();
      waveShaper.curve = makeDistortionCurve(6); // reduced from 12
      waveShaper.oversample = '2x';

      // 5. Output gain
      const outputGain = ctx.createGain();
      outputGain.gain.value = 0.9; // increased from 0.8

      // Connect radio signal chain
      highpass.connect(lowpass);
      lowpass.connect(bandboost);
      bandboost.connect(waveShaper);
      waveShaper.connect(outputGain);
      outputGain.connect(analyser);
      analyser.connect(ctx.destination);

      radioChainRef.current = {
        highpass,
        lowpass,
        bandboost,
        waveShaper,
        outputGain,
      };

      // 6. Background Squelch / S-Band Carrier Noise Buffer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      // Pink/brown filtered noise generator
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 1.5;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const carrierGain = ctx.createGain();
      carrierGain.gain.value = 0.0; // muted by default
      carrierNoiseGainRef.current = carrierGain;

      noiseSource.connect(carrierGain);
      carrierGain.connect(highpass);
      try {
        noiseSource.start();
      } catch {
        // ignore if already started
      }
    }

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    return audioCtxRef.current;
  }, []);

  // 2. Apollo Quindar Tone Generator (2525 Hz intro, 2475/2525 Hz outro push-to-talk beep)
  const playQuindarTone = useCallback((freq = 2525, duration = 0.025) => {
    if (isMuted) return;
    try {
      const ctx = initAudioChain();
      if (!ctx || !analyserRef.current) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Clean fast envelope (no click artifacts)
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.003);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + duration - 0.003);
      gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(analyserRef.current);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Failed to play Quindar tone:', e);
    }
  }, [isMuted, initAudioChain]);

  // 3. Squelch / S-Band Carrier Control
  const setCarrierSquelch = useCallback((active: boolean) => {
    if (!carrierNoiseGainRef.current || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const gain = carrierNoiseGainRef.current.gain;
      const target = active && !isMuted ? 0.025 : 0.0;
      gain.cancelScheduledValues(ctx.currentTime);
      gain.linearRampToValueAtTime(target, ctx.currentTime + 0.04);
    } catch {
      // ignore
    }
  }, [isMuted]);

  // 4. Voice Enumeration & Natural Voice Prioritizer
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const populateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (!allVoices || allVoices.length === 0) return;

      // Filter for English voices first
      const englishVoices = allVoices.filter(v => v.lang.startsWith('en'));
      const candidatePool = englishVoices.length > 0 ? englishVoices : allVoices;

      // Ranking heuristic:
      // 1. Google US English / Microsoft Guy Online (Natural) / Jenny Online (Natural)
      // 2. Any voice marked "(Natural)"
      // 3. en-US locale
      // 4. en-GB / en-AU / other English
      const scoreVoice = (v: SpeechSynthesisVoice): number => {
        const name = v.name.toLowerCase();
        let score = 0;
        // High preference for high-quality natural voices
        if (name.includes('natural') || name.includes('online')) score += 100;
        if (name.includes('google')) score += 50;
        if (name.includes('microsoft')) score += 40;
        
        // Prefer specific names that are known to sound better
        if (name.includes('guy') || name.includes('davis') || name.includes('jenny')) score += 30;
        
        if (v.lang === 'en-US' || v.lang === 'en_US') score += 50;
        else if (v.lang.startsWith('en')) score += 30;
        
        if (v.default) score += 10;
        return score;
      };

      const sortedVoices = [...candidatePool].sort((a, b) => scoreVoice(b) - scoreVoice(a));
      setVoices(candidatePool);

      // Auto-select best voice if not already selected
      if (!selectedVoice && sortedVoices.length > 0) {
        setSelectedVoice(sortedVoices[0]);
      }
    };

    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [selectedVoice]);

  // 5. Simulated radio voice modulation onto analyser node
  // Since Web Speech API cannot route PCM directly to an AudioNode in some browsers,
  // we animate a dynamic telemetry carrier signal into the analyser during speech
  // so the frequency visualizer accurately responds to the active transmission.
  const startRadioModulation = useCallback(() => {
    const ctx = initAudioChain();
    if (!ctx || !analyserRef.current || !radioChainRef.current) return;

    // Create synthetic speech formants for the visualizer
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const voiceModGain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(130, ctx.currentTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(260, ctx.currentTime);

    voiceModGain.gain.setValueAtTime(0.001, ctx.currentTime);

    osc1.connect(voiceModGain);
    osc2.connect(voiceModGain);
    voiceModGain.connect(radioChainRef.current.highpass);

    osc1.start();
    osc2.start();

    // Modulate gain to mimic syllabic speech cadence
    speechIntervalRef.current = window.setInterval(() => {
      if (!audioCtxRef.current) return;
      const now = audioCtxRef.current.currentTime;
      const targetGain = Math.random() > 0.15 ? 0.015 + Math.random() * 0.035 : 0.002;
      voiceModGain.gain.linearRampToValueAtTime(targetGain, now + 0.05);
      osc1.frequency.linearRampToValueAtTime(110 + Math.random() * 90, now + 0.08);
      osc2.frequency.linearRampToValueAtTime(220 + Math.random() * 180, now + 0.08);
    }, 90);

    return () => {
      if (speechIntervalRef.current) {
        clearInterval(speechIntervalRef.current);
        speechIntervalRef.current = null;
      }
      try {
        voiceModGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
        setTimeout(() => {
          osc1.stop();
          osc2.stop();
          osc1.disconnect();
          osc2.disconnect();
          voiceModGain.disconnect();
        }, 80);
      } catch {
        // ignore
      }
    };
  }, [initAudioChain]);

  const activeCleanupRef = useRef<(() => void) | null>(null);

  // 6. Stop / Cancel Transmission
  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (filterEnabled && isSpeaking) {
      playQuindarTone(2475, 0.025); // CapCom release beep
    }
    setCarrierSquelch(false);
    if (activeCleanupRef.current) {
      activeCleanupRef.current();
      activeCleanupRef.current = null;
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentText(null);
  }, [filterEnabled, isSpeaking, playQuindarTone, setCarrierSquelch]);

  // 7. Pause & Resume
  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setCarrierSquelch(false);
    }
  }, [setCarrierSquelch]);

  const resume = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      if (filterEnabled) {
        setCarrierSquelch(true);
      }
    }
  }, [filterEnabled, setCarrierSquelch]);

  // 8. Toggle Mute
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      if (next && isSpeaking) {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
        setCarrierSquelch(false);
      }
      return next;
    });
  }, [isSpeaking, setCarrierSquelch]);

  // 9. Speak Mission Log (Core API)
  const speakMissionLog = useCallback(
    (text: string, enableRadioFilterParam?: boolean) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        console.warn('SpeechSynthesis not supported on this platform');
        return;
      }

      if (isMuted) return;

      const effectiveFilter = enableRadioFilterParam !== undefined ? enableRadioFilterParam : filterEnabled;

      // Cancel any ongoing utterance
      stop();

      initAudioChain();

      // Clean markdown tags or bullets from text if present for clearer aerospace speech
      const cleanedText = text
        .replace(/[*_#`~[\]]/g, '')
        .replace(/https?:\/\/\S+/g, 'link')
        .replace(/\s+/g, ' ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      if (effectiveFilter) {
        // Apollo start transmission sequence:
        // 1. Quindar intro tone (2525 Hz)
        playQuindarTone(2525, 0.03);

        // 2. Bring up S-band carrier squelch
        setCarrierSquelch(true);

        // 3. Start audio frequency visualizer driver
        activeCleanupRef.current = startRadioModulation() || null;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        setCurrentText(text);
      };

      utterance.onend = () => {
        if (effectiveFilter) {
          // Apollo outro tone (2475 Hz or 2525 Hz release beep)
          playQuindarTone(2475, 0.03);
          setCarrierSquelch(false);
        }
        if (activeCleanupRef.current) {
          activeCleanupRef.current();
          activeCleanupRef.current = null;
        }
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentText(null);
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        if (activeCleanupRef.current) {
          activeCleanupRef.current();
          activeCleanupRef.current = null;
        }
        setCarrierSquelch(false);
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentText(null);
      };

      // Slight delay so the Quindar beep is heard first like Apollo CapCom push-to-talk
      const delayMs = effectiveFilter ? 80 : 0;
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, delayMs);
    },
    [
      filterEnabled,
      initAudioChain,
      isMuted,
      pitch,
      playQuindarTone,
      rate,
      selectedVoice,
      setCarrierSquelch,
      startRadioModulation,
      stop,
      volume,
    ]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (speechIntervalRef.current) {
        clearInterval(speechIntervalRef.current);
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return {
    speakMissionLog,
    stop,
    pause,
    resume,
    toggleMute,
    voices,
    selectedVoice,
    setSelectedVoice,
    isSpeaking,
    isPaused,
    isMuted,
    filterEnabled,
    setFilterEnabled,
    pitch,
    setPitch,
    rate,
    setRate,
    volume,
    setVolume,
    analyserNode: analyserRef.current,
    audioContext: audioCtxRef.current,
    currentText,
  };
}
