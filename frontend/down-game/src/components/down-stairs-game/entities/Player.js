import { GAME_CONFIG } from "../config";
import Timer from "../utils/Timer";
import Entity from "./Entity";

let FLIPPING_PARAM = 5;

export default class Player extends Entity {
  velocity = 0;

  health;
  maxHealth;

  invincible = false;
  isSad = false;

  invincibleTimer;
  blinkTimer;
  sadTimer;

  isVisible = true;

  constructor(x, y) {
    super(x, y, GAME_CONFIG.playerWidth, GAME_CONFIG.playerHeight);
    this.health = GAME_CONFIG.initialHealth;
    this.maxHealth = GAME_CONFIG.initialHealth;

    this.invincibleTimer = new Timer(GAME_CONFIG.invincibleTime, () => {
      this.invincible = false;
    });

    this.blinkTimer = new Timer(FLIPPING_PARAM, () => {
      this.isVisible = !this.isVisible;
      this.blinkTimer.reset();
    });

    this.sadTimer = new Timer(GAME_CONFIG.invincibleTime, () => {
      this.isSad = false;
    });
  }

  updateTimers() {
    // 更新無敵計時器
    if (this.invincible) {
      this.invincibleTimer.update();
      this.blinkTimer.update();
    }

    if (this.isSad) {
      this.sadTimer.update();
    }
  }

  handleMovement(keysPressed) {
    if (keysPressed.ArrowLeft) {
      this.x = Math.max(0, this.x - GAME_CONFIG.playerMoveStep);
    }

    if (keysPressed.ArrowRight) {
      this.x = Math.min(
        GAME_CONFIG.canvasWidth - this.width,
        this.x + GAME_CONFIG.playerMoveStep
      );
    }
  }

  checkIfOnStair(stairs) {
    for (const stair of stairs) {
      if (this.isStandingOnStair(stair)) {
        this.velocity = 0;
        this.y = stair.y - this.height;
        return true;
      }
    }

    return false;
  }

  isStandingOnStair(stair) {
    return (
      this.y + this.height >= stair.y - 2 &&
      this.y + this.height <= stair.y + stair.height + 2 &&
      this.x + this.width > stair.x &&
      this.x < stair.x + stair.width
    );
  }

  applyGravity(stairs) {
    const prevY = this.y;
    this.velocity -= GAME_CONFIG.gravity;
    this.y -= this.velocity;

    if (this.velocity < 0) {
      this.checkForMidairCollisions(stairs, prevY);
    }
  }

  checkForMidairCollisions(stairs, prevY) {
    for (const stair of stairs) {
      if (
        prevY + this.height <= stair.y && // 之前在階梯上方
        this.y + this.height >= stair.y && // 現在穿過階梯
        this.isStandingOnStair(stair)
      ) {
        this.y = stair.y - this.height;
        this.velocity = 0;
        break;
      }
    }
  }

  isStandingOnStair(stair) {
    return (
      this.y + this.height >= stair.y - 2 &&
      this.y + this.height <= stair.y + stair.height + 2 &&
      this.x + this.width > stair.x &&
      this.x < stair.x + stair.width
    );
  }

  takeDamage() {
    if (this.health <= 0 || this.invincible) return;
    this.health--;
    this.invincible = true;
    this.invincibleTimer.reset();
    this.blinkTimer.reset();
    this.isSad = true;
    this.sadTimer.reset();
  }

  // 設置初始無敵狀態
  setInitialInvincibility() {
    this.invincible = true;
    this.invincibleTimer.reset();
    this.blinkTimer.reset();
  }

  renderHealthBar(ctx) {
    const barWidth = GAME_CONFIG.healthBarWidth;
    const barHeight = GAME_CONFIG.healthBarHeight;
    const padding = GAME_CONFIG.healthBarPadding;

    // 外框
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 40, barWidth, barHeight);

    // 背景
    ctx.fillStyle = "#DDDDDD";
    ctx.fillRect(10, 40, barWidth, barHeight);

    // 血量
    const healthWidth =
      (this.health / this.maxHealth) * (barWidth - padding * 2);
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(
      10 + padding,
      40 + padding,
      healthWidth,
      barHeight - padding * 2
    );

    // 心形圖示
    ctx.fillStyle = "#FF0000";
    ctx.font = "16px Arial";
    ctx.fillText("♥ " + this.health, barWidth + 20, 40 + barHeight - 2);
  }

  // 重置玩家
  reset() {
    this.x = GAME_CONFIG.canvasWidth / 2 - this.width / 2;
    this.y = 100;
    this.velocity = 0;
    this.health = this.maxHealth;
    this.invincible = false;
    this.invincibleTimer.stop();
    this.blinkTimer.stop();
    this.isVisible = true;
    this.isSad = false;
    this.sadTimer.stop();
  }

  renderHealthBar(ctx) {
    const barWidth = GAME_CONFIG.healthBarWidth;
    const barHeight = GAME_CONFIG.healthBarHeight;
    const padding = GAME_CONFIG.healthBarPadding;

    // 外框
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 40, barWidth, barHeight);

    // 背景
    ctx.fillStyle = "#DDDDDD";
    ctx.fillRect(10, 40, barWidth, barHeight);

    // 血量
    const healthWidth =
      (this.health / this.maxHealth) * (barWidth - padding * 2);
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(
      10 + padding,
      40 + padding,
      healthWidth,
      barHeight - padding * 2
    );

    // 心形圖示
    ctx.fillStyle = "#FF0000";
    ctx.font = "16px Arial";
    ctx.fillText("♥ " + this.health, barWidth + 20, 40 + barHeight - 2);
  }

  renderFace(ctx) {
    // 眼睛
    ctx.fillStyle = "#000000";
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
      // 哭臉
      ctx.arc(
        this.x + this.width / 2,
        this.y + this.height * 0.7,
        this.width * 0.2,
        0,
        Math.PI,
        true // 嘴角向下
      );

      // 眼淚
      ctx.moveTo(this.x + this.width * 0.25, this.y + this.height * 0.35);
      ctx.lineTo(this.x + this.width * 0.25, this.y + this.height * 0.5);
      ctx.moveTo(this.x + this.width * 0.75, this.y + this.height * 0.35);
      ctx.lineTo(this.x + this.width * 0.75, this.y + this.height * 0.5);
    } else {
      // 笑臉
      ctx.arc(
        this.x + this.width / 2,
        this.y + this.height * 0.6,
        this.width * 0.2,
        0,
        Math.PI,
        false // 嘴角向上
      );
    }
    ctx.stroke();
  }

  update(keysPressed, stairs) {
    this.updateTimers();
    this.handleMovement(keysPressed);
    const onStair = this.checkIfOnStair(stairs);
    if (!onStair) {
      this.applyGravity(stairs);
    }
  }

  render(ctx) {
    if (this.invincible && !this.isVisible) {
      return;
    }

    ctx.fillStyle = "#FF6347"; // 紅色
    ctx.fillRect(this.x, this.y, this.width, this.height);

    this.renderFace(ctx);
  }
}
