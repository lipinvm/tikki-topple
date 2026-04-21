// ===================== RENDER =====================

function render() {
  const p = G.currentPlayer;

  // Turn banner
  document.getElementById('tb-avatar').style.background = HEX[p];
  document.getElementById('tb-avatar').textContent = (playerNames[p]||'?')[0].toUpperCase();
  document.getElementById('tb-name').textContent = playerNames[p];
  document.getElementById('tb-name').style.color = HEX[p];

  // Scoreboard
  const sb = document.getElementById('scoreboard');
  sb.innerHTML = '';
  for (let i = 0; i < G.numPlayers; i++) {
    const c = document.createElement('div');
    c.className = 'score-card' + (i===p?' active':'');
    c.id = `score-card-${i}`;
    c.style.position = 'relative';
    c.innerHTML = `<div style="color:${HEX[i]};font-weight:bold;font-size:0.7rem;max-width:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${playerNames[i]}</div><div class="score-val">${playerScores[i]}</div>`;
    sb.appendChild(c);
  }

  // Progress bar
  const pct = Math.min(100, (playerScores[p] / WIN_SCORE) * 100);
  document.getElementById('progress-player-name').textContent = playerNames[p];
  document.getElementById('progress-player-name').style.color = HEX[p];
  document.getElementById('progress-score').textContent = `${playerScores[p]}/${WIN_SCORE}`;
  const pf = document.getElementById('progress-fill');
  pf.style.width = `${pct}%`;
  pf.textContent = playerScores[p];
  pf.className = 'progress-fill' + (playerScores[p]>=WIN_SCORE?' winner':playerScores[p]>=25?' warning':'');

  document.getElementById('tower-count').textContent = G.stackOrder.length;

  // Stack list
  const sl = document.getElementById('stack-list');
  sl.innerHTML = '';
  G.stackOrder.forEach((id, idx) => {
    const t = G.tokenData[id];
    const d = document.createElement('div');
    const isTop = idx === 0;
    d.className = 'tiki-token' + (isTop ? ' top-tiki' : idx < 3 ? ' interactable' : '');
    const badge = isTop
      ? '<span class="token-badge badge-top">TOP</span>'
      : idx < 3 ? `<span class="token-badge badge-top">#${idx+1}</span>` : '';
    d.innerHTML = `<div class="mini-glass ${t.glassClass}">${t.glassSvg}</div>
      <div class="token-info">
        <div class="token-name">${t.glassName} ${badge}</div>
        <div class="token-value">${t.glassValue} pts</div>
        <div class="token-pos">Pos: ${idx+1}</div>
      </div>`;
    sl.appendChild(d);
  });

  // Eliminated tokens
  if (G.eliminatedTokens.length > 0) {
    const divider = document.createElement('div');
    divider.style.cssText = 'text-align:center;font-size:0.7rem;color:#C0392B;font-weight:bold;padding:4px;border-top:2px dashed #C0392B;margin-top:4px;';
    divider.textContent = 'ELIMINATED THIS ROUND';
    sl.appendChild(divider);
    G.eliminatedTokens.forEach(glassId => {
      const glass = TIKI_GLASSES.find(g => g.id === glassId);
      if (!glass) return;
      const d = document.createElement('div');
      d.className = 'tiki-token eliminated';
      d.innerHTML = `<div class="mini-glass ${glass.class}">${glass.svg}</div>
        <div class="token-info">
          <div class="token-name">${glass.name} <span class="token-badge badge-out">OUT</span></div>
          <div class="token-value">Removed this round</div>
        </div>`;
      sl.appendChild(d);
    });
  }

  renderSecretCard();
  updateCardStates();
}

function renderSecretCard() {
  const container = document.getElementById('secret-card-display');
  if (!container) return;
  const card = SECRET_TIKI_CARDS.find(c => c.id === G.playerSecretCards[G.currentPlayer]);
  if (!card) { container.innerHTML = '<div style="color:#FFF;text-align:center;">No Secret Card</div>'; return; }

  let html = `<div class="secret-card-title">SECRET: ${card.name.toUpperCase()}</div><div class="secret-tiki-list">`;
  card.tikis.forEach(tiki => {
    const glass = TIKI_GLASSES.find(g => g.id === tiki.glassId);
    const isElim = G.eliminatedTokens.includes(tiki.glassId);
    const posLabel = tiki.positions.length===1?'1st':tiki.positions.length===2?'1st-2nd':'Top 3';
    html += `<div class="secret-tiki-row" style="${isElim?'opacity:0.4;':''}">
      <div class="secret-pos">${posLabel}</div>
      <div class="secret-tiki-icon ${glass.class}">${glass.svg}</div>
      <div class="secret-tiki-name">${glass.name}${isElim?' OUT':''}</div>
      <div class="secret-points">${isElim?'ELIM':'+'+tiki.points}</div>
    </div>`;
  });
  html += '</div>';
  container.innerHTML = html;
}

function renderReorderInMsg(n) {
  const names = RS.order.map(id => G.tokenData[id].glassName).join(', ');
  setMsg(`${n===2?'SWAP':'SHUFFLE'}: Reordering [${names}]`);
  const sl = document.getElementById('stack-list');
  const reorderDiv = document.createElement('div');
  reorderDiv.id = 'reorder-controls';
  reorderDiv.style.cssText = 'background:rgba(255,215,0,0.3);border:3px solid gold;border-radius:10px;padding:8px;margin-bottom:8px;';
  reorderDiv.innerHTML = `<div style="font-size:0.8rem;font-weight:bold;color:#5D4037;text-align:center;margin-bottom:6px;">Reorder Top ${n}</div>
    <div style="display:flex;gap:6px;justify-content:center;margin-bottom:8px;">
      ${n>=2?`<button onclick="reorderSwap()" style="padding:5px 10px;font-family:'Fredoka One',cursive;background:#FF6B6B;color:white;border:2px solid #5D4037;border-radius:8px;cursor:pointer;font-size:0.8rem;">Swap</button>`:''}
      ${n>=3?`<button onclick="reorderCycle()" style="padding:5px 10px;font-family:'Fredoka One',cursive;background:#BB8FCE;color:white;border:2px solid #5D4037;border-radius:8px;cursor:pointer;font-size:0.8rem;">Cycle</button>`:''}
      <button onclick="confirmReorder()" style="padding:5px 10px;font-family:'Fredoka One',cursive;background:#27AE60;color:white;border:2px solid #5D4037;border-radius:8px;cursor:pointer;font-size:0.8rem;">Confirm</button>
      <button onclick="cancelReorder()" style="padding:5px 10px;font-family:'Fredoka One',cursive;background:#7F8C8D;color:white;border:2px solid #5D4037;border-radius:8px;cursor:pointer;font-size:0.8rem;">Cancel</button>
    </div>
    <div id="reorder-preview" style="display:flex;gap:6px;justify-content:center;"></div>`;
  sl.insertBefore(reorderDiv, sl.firstChild);
  renderReorderPreview();
}

function renderReorderPreview() {
  const preview = document.getElementById('reorder-preview');
  if (!preview) return;
  preview.innerHTML = RS.order.map((id, i) => {
    const t = G.tokenData[id];
    return `<div style="text-align:center;"><div class="mini-glass ${t.glassClass}" style="width:35px;height:45px;margin:0 auto;">${t.glassSvg}</div><div style="font-size:0.65rem;color:#5D4037;font-weight:bold;">${i+1}. ${t.glassName}</div></div>`;
  }).join('');
}

function showScoreModal(roundScores) {
  const top3 = G.stackOrder.slice(0, 3);
  const posLabels = ['1st Place','2nd Place','3rd Place'];
  const posPointLabels = ['5 pts','3 pts','2 pts'];
  const top3El = document.getElementById('modal-top3');
  top3El.innerHTML = '';
  top3.forEach((id, i) => {
    const t = G.tokenData[id];
    const slot = document.createElement('div');
    slot.className = 'podium-slot';
    slot.innerHTML = `<div class="podium-rank">${posLabels[i]}</div>
      <div style="display:flex;align-items:center;gap:6px;margin:6px 0;">
        <div class="mini-glass ${t.glassClass}" style="width:35px;height:45px;">${t.glassSvg}</div>
        <div><div style="font-weight:bold;font-size:0.85rem;">${t.glassName}</div></div>
      </div>
      <div class="podium-pts">${posPointLabels[i]}</div>`;
    top3El.appendChild(slot);
  });
  const breakdownsEl = document.getElementById('modal-breakdowns');
  breakdownsEl.innerHTML = '';
  buildScoreBreakdown(roundScores).forEach(bd => {
    const div = document.createElement('div');
    div.className = 'player-score-breakdown';
    let rowsHtml = bd.rows.map(r => `
      <div class="psb-row">
        <span>${r.name} → ${r.posLabel}</span>
        <span class="${r.pts>0?'psb-pts-pos':'psb-pts-zero'}">${r.pts>0?'+'+r.pts:'+0'}</span>
      </div>`).join('');
    div.innerHTML = `<div class="psb-header">
        <span class="psb-name" style="color:${HEX[bd.player]}">${playerNames[bd.player]}</span>
        <span class="psb-total">+${bd.total} pts this round</span>
      </div>${rowsHtml}
      <div style="text-align:right;font-size:0.8rem;color:#666;margin-top:4px;">Total: ${playerScores[bd.player]+bd.total} pts</div>`;
    breakdownsEl.appendChild(div);
  });
  document.getElementById('score-modal').classList.add('show');
}

function showScorePop(playerIdx, pts) {
  playSound('score');
  const cards = document.querySelectorAll('.score-card');
  if (!cards[playerIdx]) return;
  const pop = document.createElement('div');
  pop.className = 'score-pop';
  pop.textContent = '+' + pts;
  cards[playerIdx].style.position = 'relative';
  cards[playerIdx].appendChild(pop);
  setTimeout(() => pop.remove(), 1300);
}

function setMsg(m) {
  document.getElementById('msg-bar').textContent = m;
}

function spawnFireworks() {
  const container = document.getElementById('win-fireworks');
  container.innerHTML = '';
  const colors = ['#FFD700','#FF6B6B','#48C9B0','#BB8FCE','#5DADE2','#58D68D','#FF8C42'];
  for (let i = 0; i < 40; i++) {
    const el = document.createElement('div');
    el.className = 'firework';
    const cx = 30 + Math.random() * 40;
    const cy = 30 + Math.random() * 40;
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 150;
    el.style.cssText = `left:${cx}%;top:${cy}%;background:${colors[Math.floor(Math.random()*colors.length)]};--tx:${Math.cos(angle)*dist}px;--ty:${Math.sin(angle)*dist}px;animation-duration:${1.5+Math.random()*1.5}s;animation-delay:${Math.random()*1.5}s;width:${4+Math.random()*8}px;height:${4+Math.random()*8}px;`;
    container.appendChild(el);
  }
}

function showWin() {
  playSound('win');
  spawnFireworks();
  const ws = document.getElementById('win-screen');
  ws.style.display = 'flex';
  const winEl = document.getElementById('win-player-name');
  winEl.textContent = playerNames[G.winner];
  winEl.style.color = HEX[G.winner];
  document.getElementById('win-reason').textContent = `${playerNames[G.winner]} reached ${WIN_SCORE} points!`;
  const fs = document.getElementById('final-scores');
  fs.innerHTML = '';
  const rankings = Array.from({length:G.numPlayers},(_,i)=>i).sort((a,b)=>playerScores[b]-playerScores[a]);
  rankings.forEach((p, rank) => {
    const c = document.createElement('div');
    c.className = 'final-score-card' + (rank===0?' winner-card':'');
    const trophy = rank===0?'👑':rank===1?'🥈':rank===2?'🥉':`#${rank+1}`;
    c.innerHTML = `<div style="font-size:2.2rem;">${trophy}</div>
      <div style="color:${HEX[p]};font-weight:bold;font-size:1.1rem;margin:5px 0;">${playerNames[p]}</div>
      <div style="font-size:1.6rem;color:var(--gold);font-weight:bold;">${playerScores[p]} pts</div>`;
    fs.appendChild(c);
  });
}
