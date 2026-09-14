// sound.js — tiny WebAudio synth for feedback beeps. No external audio files
// needed, which keeps the game dependency-free and easy to re-skin: swap the
// frequencies below for a new theme's "feel" (low & harsh for horror hits,
// bright & clean for retro/arcade, etc).
const Sound = (() => {
  let ctx = null;
  let enabled = true;

  function ensureContext() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === "suspended") ctx.resume();
  }

  function beep({ freq = 440, duration = 0.1, type = "square", gain = 0.05 }) {
    if (!enabled) return;
    ensureContext();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;
    osc.connect(g).connect(ctx.destination);
    const now = ctx.currentTime;
    g.gain.setValueAtTime(gain, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.start(now);
    osc.stop(now + duration);
  }

  return {
    // Browsers block audio until a user gesture — call this from the Start
    // button's click handler.
    unlock: ensureContext,
    setEnabled(v) {
      enabled = v;
    },
    isEnabled() {
      return enabled;
    },
    hit() {
      beep({ freq: 140, duration: 0.18, type: "sawtooth", gain: 0.08 });
    },
    score() {
      beep({ freq: 880, duration: 0.06, type: "square", gain: 0.04 });
    },
    gameOver() {
      beep({ freq: 220, duration: 0.25, type: "triangle", gain: 0.07 });
      setTimeout(() => beep({ freq: 140, duration: 0.35, type: "triangle", gain: 0.07 }), 150);
    },
  };
})();
