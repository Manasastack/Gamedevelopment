// player.js — everything about the player character: position, movement,
// drawing, and the brief invulnerability window after taking a hit.
class Player {
  constructor(canvasWidth, canvasHeight) {
    this.size = 28;
    this.speed = 260; // px per second
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.reset();
  }

  reset() {
    this.x = this.canvasWidth / 2 - this.size / 2;
    this.y = this.canvasHeight - this.size - 16;
    this.invulnerableUntil = 0;
  }

  get isInvulnerable() {
    return performance.now() < this.invulnerableUntil;
  }

  takeHit() {
    this.invulnerableUntil = performance.now() + 1200; // 1.2s grace period
  }

  update(dt, input) {
    let dx = 0;
    let dy = 0;
    if (input.left) dx -= 1;
    if (input.right) dx += 1;
    if (input.up) dy -= 1;
    if (input.down) dy += 1;

    if (dx !== 0 && dy !== 0) {
      // Normalize diagonal movement so it isn't faster than moving straight.
      dx *= Math.SQRT1_2;
      dy *= Math.SQRT1_2;
    }

    this.x += dx * this.speed * dt;
    this.y += dy * this.speed * dt;

    this.x = clamp(this.x, 0, this.canvasWidth - this.size);
    this.y = clamp(this.y, 0, this.canvasHeight - this.size);
  }

  getBounds() {
    return { x: this.x, y: this.y, w: this.size, h: this.size };
  }

  draw(ctx) {
    ctx.save();
    // Flicker while invulnerable so a hit is readable at a glance.
    if (this.isInvulnerable && Math.floor(performance.now() / 90) % 2 === 0) {
      ctx.globalAlpha = 0.35;
    }
    ctx.fillStyle = getCSSVar("--accent");
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.restore();
  }
}
