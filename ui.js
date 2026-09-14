// ui.js — owns every DOM element outside the canvas: the HUD readouts, the
// three overlay screens, and the buttons. game.js tells this module *what*
// to show; this module never decides *when* on its own.
const UI = (() => {
  let els = {};
  let bestScore = 0;
  let bestTime = 0;

  function init() {
    els = {
      scoreValue: document.getElementById("scoreValue"),
      timeValue: document.getElementById("timeValue"),
      healthValue: document.getElementById("healthValue"),
      startOverlay: document.getElementById("startOverlay"),
      pauseOverlay: document.getElementById("pauseOverlay"),
      gameOverOverlay: document.getElementById("gameOverOverlay"),
      finalTime: document.getElementById("finalTime"),
      finalScore: document.getElementById("finalScore"),
      bestStats: document.getElementById("bestStats"),
      startBtn: document.getElementById("startBtn"),
      resumeBtn: document.getElementById("resumeBtn"),
      restartBtn: document.getElementById("restartBtn"),
      pauseBtn: document.getElementById("pauseBtn"),
      soundBtn: document.getElementById("soundBtn"),
    };
  }

  function bindControls({ onStart, onResume, onRestart, onPauseToggle, onSoundToggle }) {
    els.startBtn.addEventListener("click", onStart);
    els.resumeBtn.addEventListener("click", onResume);
    els.restartBtn.addEventListener("click", onRestart);
    els.pauseBtn.addEventListener("click", onPauseToggle);
    els.soundBtn.addEventListener("click", onSoundToggle);
  }

  function updateHUD(score, elapsedSeconds, health, maxHealth) {
    els.scoreValue.textContent = score;
    els.timeValue.textContent = formatTime(elapsedSeconds);
    const hearts = [];
    for (let i = 0; i < maxHealth; i++) {
      hearts.push(i < health ? "♥" : "♡");
    }
    els.healthValue.textContent = hearts.join(" ");
  }

  function setSoundLabel(enabled) {
    els.soundBtn.textContent = `Sound: ${enabled ? "On" : "Off"}`;
  }

  function show(overlay) {
    overlay.classList.remove("overlay--hidden");
  }
  function hide(overlay) {
    overlay.classList.add("overlay--hidden");
  }

  function showStart() {
    hide(els.pauseOverlay);
    hide(els.gameOverOverlay);
    show(els.startOverlay);
  }

  function showPlaying() {
    hide(els.startOverlay);
    hide(els.pauseOverlay);
    hide(els.gameOverOverlay);
  }

  function showPaused() {
    show(els.pauseOverlay);
  }

  function hidePaused() {
    hide(els.pauseOverlay);
  }

  function showGameOver(score, elapsedSeconds) {
    if (score > bestScore) bestScore = score;
    if (elapsedSeconds > bestTime) bestTime = elapsedSeconds;
    els.finalScore.textContent = score;
    els.finalTime.textContent = formatTime(elapsedSeconds);
    els.bestStats.textContent = `Best this session: ${bestScore} pts, ${formatTime(bestTime)} survived`;
    show(els.gameOverOverlay);
  }

  return {
    init,
    bindControls,
    updateHUD,
    setSoundLabel,
    showStart,
    showPlaying,
    showPaused,
    hidePaused,
    showGameOver,
  };
})();
