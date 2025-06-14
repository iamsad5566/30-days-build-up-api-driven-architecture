import { GAME_CONFIG, ScoreLevel } from "./config";
import { GameState } from "./GameStateManager";

export default class GameRenderer {
  config;

  constructor(config = undefined) {
    this.config = {
      width: GAME_CONFIG.canvasWidth,
      height: GAME_CONFIG.canvasHeight,
      backgroundColor: "#87CEEB",
      textColor: "#FFFFFF",
      overlayColor: "rgba(0,0,0,0.7)",
      ...config,
    };
  }

  render(ctx, gameState, player, stairs, stats) {
    this.clearCanvas(ctx);
    // this.renderBackground(ctx);

    switch (gameState) {
      case GameState.NOT_STARTED:
        this.renderEntities(ctx, player, stairs);
        this.renderStartScreen(ctx);
        break;

      case GameState.PLAYING:
        this.renderEntities(ctx, player, stairs);
        this.renderUI(ctx, player, stats);
        break;

      case GameState.GAME_OVER:
        this.renderEntities(ctx, player, stairs);
        this.renderGameOverScreen(ctx, stats);
        break;

      default:
        break;
    }
  }

  clearCanvas(ctx) {
    ctx.clearRect(0, 0, this.config.width, this.config.height);
  }

  renderBackground(ctx) {
    gradient = ctx.createLinearGradient(0, 0, 0, this.config.height);
    gradient.addColorStop(0, "#87CEEB"); // 天空藍
    gradient.addColorStop(1, "#4682B4"); // 鋼藍
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.config.width, this.config.height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    this.drawCloud(ctx, 50, 80, 70, 30);
    this.drawCloud(ctx, 250, 40, 60, 25);
    this.drawCloud(ctx, 150, 120, 80, 35);
  }

  renderEntities(ctx, player, stairs) {
    for (const stair of stairs) {
      stair.render(ctx);
    }

    player.render(ctx);
  }

  renderUI(ctx, player, stats) {
    this.renderScore(ctx, stats.score);
    player.renderHealthBar(ctx);
    this.renderGameTime(ctx, stats.timeElapsedInSeconds);
  }

  renderScore(ctx, score) {
    ctx.fillStyle = "#000000";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`分數： ${score}`, 10, 30);
  }

  renderHighestScore(ctx, highestScore) {
    ctx.fillStyle = "#000000";
    ctx.font = "20px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`最高分數： ${highestScore}`, this.config.width - 10, 30);
  }

  renderGameTime(ctx, seconds) {
    let minutes = Math.floor(seconds / 60);
    let remaingSeconds = seconds % 60;

    ctx.fillStyle = "#000000";
    ctx.font = "16px Arial";
    ctx.textAlign = "right";
    ctx.fillText(
      `時間： ${minutes}:${remaingSeconds.toString().padStart(2, "0")}`,
      this.config.width - 10,
      30
    );
  }

  drawCloud(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.moveTo(x, y + height / 2);
    ctx.bezierCurveTo(
      x,
      y,
      x + width / 2,
      y - height / 2,
      x + width,
      y + height / 2
    );
    ctx.bezierCurveTo(
      x + width * 1.2,
      y + height,
      x + width * 0.8,
      y + height * 1.5,
      x + width / 2,
      y + height
    );
    ctx.bezierCurveTo(
      x + width / 5,
      y + height * 1.2,
      x,
      y + height,
      x,
      y + height / 2
    );
    ctx.closePath();
    ctx.fill();
  }

  renderStartScreen(ctx) {
    ctx.fillStyle = this.config.overlayColor;
    ctx.fillRect(0, 0, this.config.width, this.config.height);

    ctx.fillStyle = this.config.textColor;
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "小朋友下樓梯",
      this.config.width / 2,
      this.config.height / 2 - 50
    );

    ctx.font = "20px Arial";
    ctx.fillText(
      "← → 鍵控制移動",
      this.config.width / 2,
      this.config.height / 2
    );

    ctx.fillText(
      "避免撞到頂部或掉下去",
      this.config.width / 2,
      this.config.height / 2 + 40
    );
    ctx.fillText(
      "點擊開始遊戲",
      this.config.width / 2,
      this.config.height / 2 + 80
    );
  }

  renderGameOverScreen(ctx, stats) {
    ctx.fillStyle = this.config.overlayColor;
    ctx.fillRect(0, 0, this.config.width, this.config.height);

    ctx.fillStyle = this.config.textColor;
    ctx.font = "30px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
      "遊戲結束",
      this.config.width / 2,
      this.config.height / 2 - 60
    );

    ctx.fillText(
      `最終分數： ${stats.score}`,
      this.config.width / 2,
      this.config.height / 2 - 10
    );

    ctx.font = "20px Arial";
    let comment = this.getScoreComment(stats.score);
    ctx.fillText(comment, this.config.width / 2, this.config.height / 2 + 30);

    ctx.fillText(
      "點擊重新開始",
      this.config.width / 2,
      this.config.height / 2 + 70
    );
  }

  getScoreComment(score) {
    if (score < ScoreLevel.LOW) {
      return "再多練習一下吧！";
    } else if (score < ScoreLevel.MEDIUM) {
      return "還不錯的表現！";
    } else if (score < ScoreLevel.HIGH) {
      return "真是太棒了！";
    } else {
      return "你是下樓梯大師！";
    }
  }
}
