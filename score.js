// score.js — score, elapsed time, and the difficulty curve derived from them.
// Keeping this separate means "make the game ramp up faster/slower" is a
// one-file change.
class ScoreBoard {
  constructor() {
    this.reset();
  }

  reset() {
    this.elapsed = 0;
    this.score = 0;
  }

  update(dt, obstacleField, playerBounds) {
    this.elapsed += dt;
    this.score += Math.round(dt * 10); // base points for time survived

    const passed = obstacleField.collectPassed(playerBounds);
    if (passed > 0) {
      this.score += passed * 5; // bonus for each obstacle that clears the player
    }
  }

  addHitPenalty() {
    this.score = Math.max(0, this.score - 15);
  }

  // 0 at the start, ~1 around 45s survived, and keeps climbing slowly after that.
  get difficulty() {
    return this.elapsed / 45;
  }
}
