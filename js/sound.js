// ===================== SOUND SYSTEM =====================
let audioCtx = null;
let soundEnabled = true;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);

    if (type === 'click') {
      o.type = 'sine'; o.frequency.setValueAtTime(880, ctx.currentTime);
      g.gain.setValueAtTime(0.15, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      o.start(); o.stop(ctx.currentTime + 0.12);

    } else if (type === 'move') {
      o.type = 'triangle'; o.frequency.setValueAtTime(440, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15);
      g.gain.setValueAtTime(0.2, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      o.start(); o.stop(ctx.currentTime + 0.25);

    } else if (type === 'topple') {
      o.type = 'sawtooth'; o.frequency.setValueAtTime(300, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
      g.gain.setValueAtTime(0.2, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      o.start(); o.stop(ctx.currentTime + 0.3);

    } else if (type === 'win') {
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        const o2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        o2.connect(g2); g2.connect(ctx.destination);
        o2.type = 'sine'; o2.frequency.value = freq;
        g2.gain.setValueAtTime(0, ctx.currentTime + i*0.12);
        g2.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i*0.12 + 0.05);
        g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i*0.12 + 0.35);
        o2.start(ctx.currentTime + i*0.12); o2.stop(ctx.currentTime + i*0.12 + 0.35);
      });

    } else if (type === 'score') {
      o.type = 'sine'; o.frequency.setValueAtTime(660, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(990, ctx.currentTime + 0.2);
      g.gain.setValueAtTime(0.18, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      o.start(); o.stop(ctx.currentTime + 0.3);
    }
  } catch(e) {}
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById('sound-toggle');
  btn.classList.toggle('on', soundEnabled);
  if (soundEnabled) playSound('click');
}
