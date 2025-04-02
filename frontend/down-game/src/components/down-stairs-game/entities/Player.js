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

  render() {
    ctx.fillStyle = "#FF6347";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // 臉部表情
    ctx.fillStyle = "#000000";

    // 眼睛
    ctx.fillRect(
      this.x + this.width * 0.2,
      this.y + this.height * 0.2,
      this.width * 0.15,
      this.height * 0.15
    );
    ctx.fillRect(
      this.x + this.width * 0.65,
      this.y + this.height * 0.2,
      this.width * 0.15,
      this.height * 0.15
    );

    // 嘴巴
    ctx.beginPath();
    if (this.isSad) {
      ctx.arc(
        this.x + this.width / 2,
        this.y + this.height * 0.7,
        this.width * 0.2,
        0,
        Math.PI,
        true
      );
      ctx.moveTo(this.x + this.width * 0.25, this.y + this.height * 0.35);
      ctx.lineTo(this.x + this.width * 0.25, this.y + this.height * 0.5);
      ctx.moveTo(this.x + this.width * 0.75, this.y + this.height * 0.35);
      ctx.lineTo(this.x + this.width * 0.75, this.y + this.height * 0.5);
    } else {
      ctx.arc(
        this.x + this.width / 2,
        this.y + this.height * 0.6,
        this.width * 0.2,
        0,
        Math.PI,
        false
      );
    }
    ctx.stroke();
  }

  takeDamage() {}
  reset() {}
  renderHealthBar() {}
}
