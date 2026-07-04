let ctx: AudioContext | null = null;

function getContext() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    ctx = new AudioCtx();
  }
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

function playPattern(notes: number[], volume: number, waveform: OscillatorType) {
  try {
    const audioCtx = getContext();
    const now = audioCtx.currentTime;

    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = waveform;
      osc.frequency.value = freq;
      const start = now + i * 0.16;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.42);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + 0.45);
    });
  } catch {
    // Web Audio can be blocked before any user interaction — fail silently.
  }
}

/**
 * Starts a loud repeating alarm that lasts `durationMs` (default 30s), playing
 * `notes` every `intervalMs`. Returns a function that stops it early if needed.
 */
function startAlarm(
  notes: number[],
  waveform: OscillatorType,
  volume: number,
  durationMs = 30000,
  intervalMs = 1100
): () => void {
  let stopped = false;
  let elapsed = 0;

  playPattern(notes, volume, waveform);

  const timer = setInterval(() => {
    elapsed += intervalMs;
    if (stopped || elapsed >= durationMs) {
      clearInterval(timer);
      return;
    }
    playPattern(notes, volume, waveform);
  }, intervalMs);

  return () => {
    stopped = true;
    clearInterval(timer);
  };
}

/** Loud alarm for "target reached" — repeats for ~30 seconds. Returns a stop function. */
export function playChime(): () => void {
  return startAlarm([880, 1320, 880], "square", 0.55, 30000, 1100);
}

/** Loud, more celebratory alarm for "daily goal completed" — repeats for ~30 seconds. Returns a stop function. */
export function playFanfare(): () => void {
  return startAlarm([523, 659, 784, 1046], "triangle", 0.6, 30000, 1300);
}
