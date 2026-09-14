// obstacles.js — the falling hazards. Everything about spawning, moving, and
// colliding lives here, so re-theming them ("meteors", "ghosts", "asteroids")
// only means changing how they're drawn and named, not how they behave.
class ObstacleField {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.reset();
  }

  reset() {
    this.items = [];
    this.spawnTimer = 0;
  }

  // difficulty is a 0..1+ value from ScoreBoard — higher means faster & more frequent.
  update(dt, difficulty) {
    const spawnInterval = clamp(0.9 - difficulty * 0.5, 0.22, 0.9);
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawn();
      this.spawnTimer = spawnInterval;
    }

    const fallSpeed = 140 + difficulty * 220;
    for (const item of this.items) {
      item.y += fallSpeed * dt * item.speedMult;
    }
    this.items = this.items.filter((item) => item.y < this.canvasHeight + 40);
  }

  spawn() {
    const size = 18 + Math.random() * 22;
    this.items.push({
      x: Math.random() * (this.canvasWidth - size),
      y: -size,
      size,
      speedMult: 0.8 + Math.random() * 0.6,
      passed: false, // flips true once it clears the player, for score.js
    });
  }

  draw(ctx) {
    ctx.fillStyle = getCSSVar("--danger");
    for (const item of this.items) {
      ctx.fillRect(item.x, item.y, item.size, item.size);
    }
  }

  // Simple AABB collision against the player's bounding box.
  checkCollision(playerBounds) {
    for (const item of this.items) {
      const overlap =
        playerBounds.x < item.x + item.size &&
        playerBounds.x + playerBounds.w > item.x &&
        playerBounds.y < item.y + item.size &&
        playerBounds.y + playerBounds.h > item.y;
      if (overlap) return item;
    }
    return null;
  }

  removeItem(item) {
    this.items = this.items.filter((i) => i !== item);
  }

  // score.js calls this each frame to award points for obstacles that clear the player.
  collectPassed(playerBounds) {
    let passedCount = 0;
    for (const item of this.items) {
      if (!item.passed && item.y > playerBounds.y + playerBounds.h) {
        item.passed = true;
        passedCount++;
      }
    }
    return passedCount;
  }
}
