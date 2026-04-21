// ===================== GAME STATE =====================
let playerNames = [...DEFAULT_NAMES];
let playerScores = [];
let G = {};
let RS = { count: 0, order: [] };
let settingsFromLanding = false;

// ===================== GAME INIT =====================
function initRound(n, firstRound) {
  const tokens = TIKI_GLASSES.map(glass => ({
    id: glass.id, glassId: glass.id, glassName: glass.name,
    glassValue: glass.value, glassClass: glass.class, glassSvg: glass.svg
  }));
  // Shuffle tokens
  for (let i = tokens.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tokens[i], tokens[j]] = [tokens[j], tokens[i]];
  }
  const numPlayers = firstRound ? n : G.numPlayers;
  const currentPlayer = firstRound ? 0 : G.currentPlayer;
  G = {
    numPlayers, currentPlayer,
    turnCount: firstRound ? 1 : G.turnCount,
    roundTurnCount: 0,
    phase: 'action',
    stackOrder: tokens.map(t => t.id),
    tokenData: Object.fromEntries(tokens.map(t => [t.id, t])),
    playerSecretCards: {},
    eliminatedTokens: [],
    gameOver: false,
    winner: -1,
    roundNumber: firstRound ? 1 : (G.roundNumber || 1)
  };
  // Assign secret cards
  let available = [...SECRET_TIKI_CARDS];
  for (let p = 0; p < numPlayers; p++) {
    const idx = Math.floor(Math.random() * available.length);
    G.playerSecretCards[p] = available[idx].id;
    available.splice(idx, 1);
  }
}

// ===================== SCORING =====================
function calcRoundScores() {
  const activeStack = G.stackOrder;
  const top3 = activeStack.slice(0, 3);
  const roundScores = Array(G.numPlayers).fill(0);
  for (let p = 0; p < G.numPlayers; p++) {
    const card = SECRET_TIKI_CARDS.find(c => c.id === G.playerSecretCards[p]);
    if (!card) continue;
    for (const tikiReq of card.tikis) {
      const posInTop3 = top3.findIndex(id => G.tokenData[id].glassId === tikiReq.glassId);
      if (posInTop3 !== -1) {
        const position = posInTop3 + 1;
        roundScores[p] += tikiReq.positions.includes(position) ? tikiReq.points : (POS_POINTS[position] || 0);
      }
    }
  }
  return roundScores;
}

function buildScoreBreakdown(roundScores) {
  const top3 = G.stackOrder.slice(0, 3);
  const breakdown = [];
  for (let p = 0; p < G.numPlayers; p++) {
    const card = SECRET_TIKI_CARDS.find(c => c.id === G.playerSecretCards[p]);
    if (!card) continue;
    const rows = [];
    for (const tikiReq of card.tikis) {
      const glass = TIKI_GLASSES.find(g => g.id === tikiReq.glassId);
      const isElim = G.eliminatedTokens.includes(tikiReq.glassId);
      const posInTop3 = top3.findIndex(id => G.tokenData[id].glassId === tikiReq.glassId);
      let pts = 0, posLabel = '—';
      if (isElim) { posLabel = 'Eliminated'; }
      else if (posInTop3 !== -1) {
        const position = posInTop3 + 1;
        posLabel = `Position ${position}`;
        pts = tikiReq.positions.includes(position) ? tikiReq.points : (POS_POINTS[position] || 0);
      } else { posLabel = 'Not in Top 3'; }
      rows.push({ name: glass.name, posLabel, pts });
    }
    breakdown.push({ player: p, rows, total: roundScores[p] });
  }
  return breakdown;
}

function startNewRound() {
  document.getElementById('score-modal').classList.remove('show');
  const roundScores = calcRoundScores();
  for (let p = 0; p < G.numPlayers; p++) {
    playerScores[p] += roundScores[p];
    if (roundScores[p] > 0) showScorePop(p, roundScores[p]);
  }
  const winner = playerScores.findIndex(s => s >= WIN_SCORE);
  if (winner !== -1) { G.winner = winner; showWin(); return; }
  G.roundNumber = (G.roundNumber || 1) + 1;
  G.currentPlayer = (G.currentPlayer + 1) % G.numPlayers;
  G.turnCount++;
  initRound(G.numPlayers, false);
  showHandoff(false);
}

function triggerRoundEnd() {
  const roundScores = calcRoundScores();
  showScoreModal(roundScores);
}

// ===================== ACTIONS =====================
function doMove(n) {
  if (G.phase !== 'action') return;
  playSound('move');
  setMsg(`Moved top ${n} tiki${n>1?'s':''} forward!`);
  setTimeout(advanceTurn, 800);
}

function doTopple() {
  if (G.phase !== 'action') return;
  if (G.stackOrder.length < 2) { setMsg('Not enough tikis to topple!'); return; }
  playSound('topple');
  const topToken = G.stackOrder.shift();
  G.stackOrder.push(topToken);
  setMsg(`Toppled ${G.tokenData[topToken].glassName} to the bottom!`);
  render();
  setTimeout(advanceTurn, 1000);
}

function doToast() {
  if (G.phase !== 'action') return;
  if (G.roundTurnCount === 0) {
    setMsg('Heat Blast cannot be played on your first turn! Choose another card.');
    const card = document.getElementById('card-toast');
    card.classList.add('blocked');
    setTimeout(() => card.classList.remove('blocked'), 1200);
    return;
  }
  if (G.stackOrder.length <= 3) {
    setMsg('Cannot use Heat Blast — only 3 tikis remain! Round ends now.');
    setTimeout(triggerRoundEnd, 800);
    return;
  }
  playSound('topple');
  const bottomId = G.stackOrder[G.stackOrder.length - 1];
  const bottomToken = G.tokenData[bottomId];
  const allTokenEls = document.querySelectorAll('.tiki-token');
  const lastEl = allTokenEls[allTokenEls.length - 1];
  if (lastEl) lastEl.classList.add('topple-out');
  setTimeout(() => {
    G.stackOrder.pop();
    G.eliminatedTokens.push(bottomToken.glassId);
    setMsg(`Heat Blast! ${bottomToken.glassName} is out of this round!`);
    render();
    if (G.stackOrder.length <= 3) setTimeout(triggerRoundEnd, 600);
    else setTimeout(advanceTurn, 800);
  }, 500);
}

function startReorder(n) {
  if (G.phase !== 'action') return;
  playSound('click');
  RS = { count: n, order: [...G.stackOrder.slice(0, n)] };
  G.phase = 'reorder';
  updateCardStates();
  renderReorderInMsg(n);
}

function reorderSwap() {
  if (RS.count >= 2) { [RS.order[0], RS.order[1]] = [RS.order[1], RS.order[0]]; renderReorderPreview(); }
}

function reorderCycle() {
  RS.order.push(RS.order.shift());
  renderReorderPreview();
}

function confirmReorder() {
  G.stackOrder = [...RS.order, ...G.stackOrder.slice(RS.count)];
  cancelReorder();
  render();
  setMsg('Reorder confirmed!');
  setTimeout(advanceTurn, 600);
}

function cancelReorder() {
  G.phase = 'action';
  const rc = document.getElementById('reorder-controls');
  if (rc) rc.remove();
  render();
  updateCardStates();
}

function advanceTurn() {
  G.roundTurnCount++;
  G.currentPlayer = (G.currentPlayer + 1) % G.numPlayers;
  G.turnCount++;
  G.phase = 'action';
  showHandoff(false);
}

function updateCardStates() {
  const inReorder = G.phase === 'reorder';
  document.querySelectorAll('.tiki-card').forEach(card => {
    card.classList.toggle('disabled', inReorder);
  });
}
