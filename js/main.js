// ===================== MAIN ENTRY POINT =====================
// Initializes the landing screen floating tiki animation on page load.

function initFloatingTikis() {
  const container = document.getElementById('landing-tikis');
  const symbols = ['▲', '●', '■', '◆'];
  for (let i = 0; i < 12; i++) {
    const el = document.createElement('span');
    el.className = 'float-tiki';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.animationDuration = (8 + Math.random() * 12) + 's';
    el.style.animationDelay = (Math.random() * 15) + 's';
    el.style.fontSize = (1.5 + Math.random() * 2) + 'rem';
    container.appendChild(el);
  }
}

// Run on page load
initFloatingTikis();
