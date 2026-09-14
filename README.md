# Prompt Arcade — Base Game: Dodge

A tiny, modular browser game built to survive a full reskin in minutes. This is
the "base game" a Prompt Arcade prep plan recommends having ready before the
event, so that a random theme becomes a mutation of a working game instead of
a build from zero.

## Run it

No build step, no install, no server required.

1. Open `index.html` directly in Chrome — double-click it, or drag it into a
   browser window.
2. Or, for live-reload while editing in VS Code, install the "Live Server"
   extension and click "Go Live".

## How to play

Move the square with `WASD` or the arrow keys, or press `Space` at the start
screen. Blocks fall from the top and speed up the longer you survive. You have
3 hearts; a hit costs one heart and gives a brief flicker of invulnerability.
Score comes from time survived plus a bonus for every block that clears you.
`Escape` or `P` pauses. Game ends at 0 hearts.

## File structure

```
prompt-arcade/
├── index.html     page structure, HUD markup, and the three overlay screens
├── style.css       all visual design — a theme change lives almost entirely here
├── utils.js         shared helpers (CSS variable reader, clamp, time format)
├── sound.js          WebAudio beeps — no audio files to manage
├── player.js          player movement, bounds, invulnerability
├── obstacles.js        spawning, falling, and collision for hazards
├── score.js             score + elapsed time + difficulty curve
├── ui.js                  DOM/overlay management (HUD, start/pause/game-over)
└── game.js                 state machine + main loop; wires everything together
```

Each file owns one system on purpose, so a rule change usually touches one
file: "obstacles fall faster" is `obstacles.js`, "hearts go up to 5" is
`game.js`'s `MAX_HEALTH`, "scoring changes" is `score.js`.

## Reskinning for a random theme

Most of a theme swap should happen in **style.css** alone:

- `--bg-deep`, `--bg-panel`, `--screen-bg` — background colors
- `--accent`, `--accent-soft` — player / UI highlight color
- `--danger` — obstacle / damage color
- `--font-display`, `--font-body`, `--font-mono` — update the Google Fonts
  `<link>` in `index.html` to match whatever you swap in here
- the `#gameTitle` text and `.marquee-sub` line in `index.html`

Player and obstacles are drawn as flat rectangles read from those same CSS
variables (see `getCSSVar()` in `utils.js`), so a palette change alone
recolors gameplay too — no JS edits needed. If a theme calls for real
sprites instead of flat shapes, swap the `ctx.fillRect(...)` calls in
`player.js` / `obstacles.js` for `ctx.drawImage(...)`.

A few examples:

- **Horror** — near-black screen, a sickly green accent, obstacles renamed
  "specters" in the copy, slower and sparser spawns for dread instead of chaos
- **Sci-fi** — deep navy/violet palette, a cyan accent, obstacles framed as
  "debris"
- **Retro** — high-contrast palette, a blocky pixel display font, maybe a
  scanline overlay added as a CSS `::after` on `.screen`

## Practicing the 15-minute surprise

Time yourself (or Claude Code) against this codebase on prompts like:

- Add a second obstacle type with a different size, speed, and point value
- Add a power-up that grants 2 seconds of invulnerability on pickup
- Reverse the controls for 5 seconds after taking a hit
- Swap the fail condition from "3 hits" to "a 60-second survival timer"
- Add a combo multiplier that resets on every hit

Most of these should only touch `obstacles.js` and `score.js` for behavior,
plus `ui.js` or `style.css` for anything visual.

## Using Claude Code with this repo

Keep requests specific and incremental: name the exact behavior you want,
let it inspect the relevant file first, and test after each change rather
than stacking several asks at once. Keep your prompt history and commits —
Prompt Arcade's rules ask teams to be able to show their AI usage if judges
ask, and Git makes it painless to revert if a change breaks something.
