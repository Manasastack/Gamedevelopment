// game.js — the state machine and main loop. This file wires the other
// modules together; it shouldn't contain movement/collision/scoring logic
// itself, so that changing a rule usually means editing exactly one file.
(() => {
  const CANVAS_W = 640;
  const CANVAS_H = 480;
  const MAX_HEALTH = 3;

  const STATE = { START: "start", PLAYING: "playing", PAUSED: "paused", GAMEOVER: "gameover" };
  let state = STATE.START;

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;

  const input = { left: false, right: false, up: false, down: false };
  let player, obstacles, score, health, lastTimestamp;

  function resetEntities() {
    player = new Player(CANVAS_W, CANVAS_H);
    obstacles = new ObstacleField(CANVAS_W, CANVAS_H);
    score = new ScoreBoard();
    health = MAX_HEALTH;
  }

  function startGame() {
    Sound.unlock(); // must happen inside a user-gesture handler
    resetEntities();
    state = STATE.PLAYING;
    UI.showPlaying();
    UI.updateHUD(score.score, score.elapsed, health, MAX_HEALTH);
    lastTimestamp = performance.now();
    requestAnimationFrame(loop);
  }

  function togglePause() {
    if (state === STATE.PLAYING) {
      state = STATE.PAUSED;
      UI.showPaused();
    } else if (state === STATE.PAUSED) {
      state = STATE.PLAYING;
      UI.hidePaused();
      lastTimestamp = performance.now();
      requestAnimationFrame(loop);
    }
  }

  function endGame() {
    state = STATE.GAMEOVER;
    Sound.gameOver();
    UI.showGameOver(score.score, score.elapsed);
  }

  function loop(timestamp) {
    if (state !== STATE.PLAYING) return;
    // Clamp dt so tabbing away and back doesn't dump a huge time jump into the sim.
    const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
    lastTimestamp = timestamp;

    update(dt);
    render();

    if (state === STATE.PLAYING) requestAnimationFrame(loop);
  }

  function update(dt) {
    player.update(dt, input);
    obstacles.update(dt, score.difficulty);
    score.update(dt, obstacles, player.getBounds());

    if (!player.isInvulnerable) {
      const hit = obstacles.checkCollision(player.getBounds());
      if (hit) {
        obstacles.removeItem(hit);
        player.takeHit();
        score.addHitPenalty();
        health -= 1;
        Sound.hit();
        if (health <= 0) {
          endGame();
          return;
        }
      }
    }

    UI.updateHUD(score.score, score.elapsed, health, MAX_HEALTH);
  }

  function render() {
    ctx.fillStyle = getCSSVar("--screen-bg", "#000");
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    obstacles.draw(ctx);
    player.draw(ctx);
  }

  // --- input handling ---
  const KEY_MAP = {
    ArrowLeft: "left", a: "left", A: "left",
    ArrowRight: "right", d: "right", D: "right",
    ArrowUp: "up", w: "up", W: "up",
    ArrowDown: "down", s: "down", S: "down",
  };

  window.addEventListener("keydown", (e) => {
    if (KEY_MAP[e.key]) input[KEY_MAP[e.key]] = true;
    if (e.key === "Escape" || e.key === "p" || e.key === "P") togglePause();
    if (e.key === " " && state === STATE.START) startGame();
  });

  window.addEventListener("keyup", (e) => {
    if (KEY_MAP[e.key]) input[KEY_MAP[e.key]] = false;
  });

  // --- wire up UI ---
  UI.init();
  UI.bindControls({
    onStart: startGame,
    onResume: togglePause,
    onRestart: startGame,
    onPauseToggle: togglePause,
    onSoundToggle: () => {
      const next = !Sound.isEnabled();
      Sound.setEnabled(next);
      UI.setSoundLabel(next);
    },
  });
  UI.setSoundLabel(Sound.isEnabled());
  UI.showStart();
})();
