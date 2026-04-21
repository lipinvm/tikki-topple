// ===================== SCREEN NAVIGATION =====================

function showLanding() {
  document.getElementById('landing-screen').style.display = 'flex';
  document.getElementById('setup-screen').style.display = 'none';
  document.getElementById('name-input-screen').style.display = 'none';
}

function showSetup() {
  playSound('click');
  document.getElementById('landing-screen').style.display = 'none';
  const ss = document.getElementById('setup-screen');
  ss.style.display = 'flex';
  ss.classList.add('screen-transition');
}

function selectPlayers(n) {
  playSound('click');
  document.getElementById('setup-screen').style.display = 'none';
  const ni = document.getElementById('name-input-screen');
  ni.style.display = 'flex';
  const fields = document.getElementById('name-fields');
  fields.innerHTML = '';
  for (let i = 0; i < n; i++) {
    const colorDot = `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${HEX[i]};margin-right:6px;vertical-align:middle;"></span>`;
    fields.innerHTML += `<div class="name-field">
      <label>${colorDot}Player ${i+1} Name</label>
      <input type="text" id="name-${i}" placeholder="Player ${i+1}" maxlength="16">
    </div>`;
  }
  ni.dataset.players = n;
}

function startGameWithNames() {
  playSound('click');
  const n = parseInt(document.getElementById('name-input-screen').dataset.players);
  playerNames = [];
  for (let i = 0; i < n; i++) {
    const val = document.getElementById('name-' + i).value.trim();
    playerNames.push(val || DEFAULT_NAMES[i]);
  }
  playerScores = Array(n).fill(0);
  document.getElementById('name-input-screen').style.display = 'none';
  initRound(n, true);
  showHandoff(true);
}

// ===================== HANDOFF SCREEN =====================
function showHandoff(isInitial) {
  const p = G.currentPlayer;
  const hs = document.getElementById('handoff-screen');
  hs.style.display = 'flex';
  document.getElementById('h-name').textContent = playerNames[p];
  document.getElementById('h-name').style.color = HEX[p];
  document.getElementById('h-sub').textContent = `Turn ${G.turnCount} · Round ${G.roundNumber}`;
  const sc = document.getElementById('h-scores');
  sc.innerHTML = '';
  for (let i = 0; i < G.numPlayers; i++) {
    const chip = document.createElement('div');
    chip.className = 'handoff-chip';
    chip.style.color = HEX[i]; chip.style.borderColor = HEX[i];
    chip.textContent = `${playerNames[i]}: ${playerScores[i]} pts`;
    sc.appendChild(chip);
  }
  setTimeout(() => {
    hs.style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    render();
    setMsg(`Your turn, ${playerNames[G.currentPlayer]}! Round ${G.roundNumber}`);
  }, 1500);
}

// ===================== SETTINGS =====================
function openSettings(fromLanding, scrollToHtp = false) {
  settingsFromLanding = fromLanding;
  document.getElementById('restart-section').style.display = fromLanding ? 'none' : 'block';
  document.getElementById('settings-modal').classList.add('show');
  if (scrollToHtp) {
    setTimeout(() => {
      document.getElementById('htp-section').scrollIntoView({ behavior: 'smooth' });
    }, 200);
  }
}

function closeSettings() {
  document.getElementById('settings-modal').classList.remove('show');
}

function confirmRestart() {
  if (confirm('Restart the game? All progress will be lost.')) {
    location.reload();
  }
}
