// utils.js — tiny shared helpers used across modules.

// Reads a color (or any value) straight from style.css, so canvas-drawn
// shapes automatically follow a theme swap without touching any JS.
function getCSSVar(name, fallback) {
  const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return val || fallback || "#ffffff";
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
