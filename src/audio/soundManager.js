// Web Audio API procedural sound synthesizer
// Generates sci-fi dynamic SFX on the fly with zero external assets needed!

class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muteState) {
    this.muted = muteState;
  }

  playMove() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio fallback silent
    }
  }

  playShift(toEra = 1) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc2.type = 'sine';

      const now = this.ctx.currentTime;
      if (toEra === 1) {
        // Shifting to Future: pitch rises sharply
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
        osc2.frequency.setValueAtTime(330, now);
        osc2.frequency.exponentialRampToValueAtTime(1320, now + 0.25);
      } else {
        // Shifting to Past: pitch descends to vintage deep tone
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.25);
        osc2.frequency.setValueAtTime(990, now);
        osc2.frequency.exponentialRampToValueAtTime(220, now + 0.25);
      }

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc2.start();
      osc.stop(now + 0.3);
      osc2.stop(now + 0.3);
    } catch {
      // Audio fallback
    }
  }

  playKey() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const startTime = this.ctx.currentTime + idx * 0.06;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch {
      // Audio fallback
    }
  }

  playEnergy() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Audio fallback
    }
  }

  playParadox() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.setValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Audio fallback
    }
  }

  playVictory() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const chords = [
        { freqs: [440, 554.37, 659.25], time: 0 },
        { freqs: [493.88, 622.25, 739.99], time: 0.2 },
        { freqs: [587.33, 739.99, 880], time: 0.4 },
        { freqs: [880, 1108.73, 1318.51], time: 0.65 }
      ];

      chords.forEach(c => {
        c.freqs.forEach(f => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const t = this.ctx.currentTime + c.time;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, t);

          gain.gain.setValueAtTime(0.1, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(t);
          osc.stop(t + 0.5);
        });
      });
    } catch {
      // Audio fallback
    }
  }
}

export const soundManager = new SoundManager();
