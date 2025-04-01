import { GAME_CONFIG } from "../config";

export default class Player extends Entity {
  velocity;
  health;
  maxHealth;
  invincible;
  invincibleCounter;
  blinkCounter;
  fallRecovery;
  isFalling;
  isSad;
  sadTimeCounter;

  constructor(x, y) {
    super(x, y, GAME_CONFIG.playerWidth, GAME_CONFIG.playerHeight);
    this.velocity = 0;
    this.health = GAME_CONFIG.initialHealth;
    this.maxHealth = GAME_CONFIG.initialHealth;
    this.invincible = false;
    this.invincibleCounter = 0;
    this.blinkCounter = 0;
    this.fallRecovery = 0;
    this.isFalling = false;
    this.isSad = false;
    this.sadTimeCounter = 0;
  }

  // Update player's position and state
  update() {}

  render() {}
}
