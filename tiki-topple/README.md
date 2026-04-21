# 🌺 Tiki Topple — Race to 35

A browser-based multiplayer party game for 2–4 players. Rearrange the Tiki Tower, score secret objectives, and be the first to reach **35 points** to win!

## 🎮 How to Play

1. Each player receives a **secret card** showing which Tikis earn them points.
2. On your turn, play one **Action Card** to rearrange the Tiki Tower.
3. After all players take a turn, everyone scores based on the top 3 Tikis.
4. First to **35 points** wins!

### Action Cards
| Card | Effect |
|------|--------|
| Step (1) | Move the top Tiki 1 space up |
| Stride (2) | Move the top Tiki 2 spaces up |
| Leap (3) | Move the top Tiki 3 spaces up |
| Swap | Swap the top 2 Tikis |
| Shuffle | Rearrange the top 3 Tikis |
| Topple | Move the top Tiki to the bottom |
| Heat Blast | Remove the bottom Tiki from this round (can't use on first turn) |

### Scoring
- **Position 1 (Top):** 5 pts base — up to 9 pts if it matches your secret card
- **Position 2:** 3 pts base — up to 5 pts if it matches your secret card
- **Position 3:** 2 pts base

## 🚀 Running the Game

Just open `index.html` in any modern browser — no server or install needed!

```
tiki-topple/
├── index.html          ← Open this file to play
├── css/
│   └── styles.css      ← All visual styling
└── js/
    ├── data.js         ← Tiki definitions, SVGs, secret cards
    ├── sound.js        ← Web Audio sound effects
    ├── game.js         ← Core game logic & actions
    ├── render.js       ← DOM rendering & UI updates
    ├── ui.js           ← Screen navigation & settings
    └── main.js         ← Entry point & landing animation
```

## 🌐 Play Online

You can host this for free using **GitHub Pages** — see the setup guide below.

## 🛠 Tech Stack

- Vanilla HTML / CSS / JavaScript — zero dependencies
- Web Audio API for sound effects
- Inline SVG for Tiki artwork

## 📝 License

MIT — free to use, modify, and share!
