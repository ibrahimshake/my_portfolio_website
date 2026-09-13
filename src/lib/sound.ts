/**
 * Audio notification utility using Web Audio API
 * Generates a clean, gentle double-chime tone for incoming message alerts
 * without requiring external MP3/WAV assets.
 */

export function playMessageChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    
    // First chime (higher tone)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

    gain1.gain.setValueAtTime(0.2, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    // Second chime (affirmative resolve)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.16); // A5
    osc2.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.28); // D6

    gain2.gain.setValueAtTime(0.001, ctx.currentTime);
    gain2.gain.setValueAtTime(0.25, ctx.currentTime + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.16);
    osc2.stop(ctx.currentTime + 0.7);
  } catch (e) {
    // Gracefully handle any browser autoplay restrictions
  }
}
