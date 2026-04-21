# 🌺 Tiki Topple — Race to 35

A browser-based multiplayer card game for 2–4 players. Rearrange the Tiki Tower to score points based on your secret card. First to 35 points wins!

## Play It

Open `index.html` in any modern browser — no installation or server required.

Or play it live on GitHub Pages once deployed (see below).

## How to Play

1. Each player gets a **Secret Card** showing which Tikis they want at the top of the stack.
2. On your turn, play one **Action Card** to rearrange the Tiki Tower.
3. After all players take a turn, everyone scores based on the top 3 Tikis.
4. **Heat Blast** removes the bottom Tiki from the round (can't use on your first turn).
5. First player to reach **35 points** wins!

### Scoring
| Position | Points |
|----------|--------|
| 1st (Top) | 5 pts (or secret card bonus) |
| 2nd | 3 pts (or secret card bonus) |
| 3rd | 2 pts (or secret card bonus) |

### Action Cards
| Card | Effect |
|------|--------|
| Step | Move top tiki 1 space up |
| Stride | Move top tiki 2 spaces up |
| Leap | Move top tiki 3 spaces up |
| Swap | Swap the top 2 tikis |
| Shuffle | Rearrange top 3 tikis |
| Topple | Move top tiki to bottom |
| Heat Blast | Remove bottom tiki from round |

## File Structure

```
tiki-topple/
├── index.html        ← Main HTML, all screens and layout
├── css/
│   └── styles.css    ← All styling, animations, responsive layout
├── js/
│   ├── data.js       ← Game constants, SVG assets, tiki and card data
│   ├── sound.js      ← Web Audio API sound effects
│   ├── game.js       ← Core game state, actions, scoring logic
│   ├── render.js     ← All DOM rendering functions
│   └── ui.js         ← Screen navigation and UI interactions
└── README.md
```

## Deploying to GitHub Pages

See the [Upload Guide](#) in the repository for step-by-step instructions on getting this live.

## Tech

- Vanilla HTML, CSS, JavaScript — no frameworks or dependencies
- Web Audio API for sound effects
- Google Fonts (Bangers, Fredoka One)
- Responsive design, works on desktop and mobile
