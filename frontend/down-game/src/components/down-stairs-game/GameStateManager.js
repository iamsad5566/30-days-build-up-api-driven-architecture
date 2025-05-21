import { GAME_CONFIG, ScoreLevel } from "./config";

export const GameState = {
  NOT_STARTED: "NOT_STARTED",
  PLAYING: "PLAYING",
  GAME_OVER: "GAME_OVER",
};

export default class GameStateManager {
  state = GameState.NOT_STARTED;

  stats = {
    score: 0,
    highScore: 0,
    gameSpeed: GAME_CONFIG.initialSpeed,
    timeElapsed: 0,
  };

  lastUpdateTime = 0;
  onStateChangeCallbacks = [];

  constructor() {
    let savedHighScore = localStorage.getItem("highScore");
    if (savedHighScore) {
      this.stats.highScore = parseInt(savedHighScore);
    }

    this.lastUpdateTime = Date.now();
  }

  setState(newState) {
    if (this.state !== newState) {
      this.state = newState;
      if (newState === GameState.GAME_OVER) {
        this.checkAndUpdateHighScore();
      }

      this.notifyStateChange(newState);
    }
  }

  onStateChange(callback) {
    this.onStateChangeCallbacks.push(callback);
  }

  notifyStateChange(newState) {
    for (const callback of this.onStateChangeCallbacks) {
      callback(newState);
    }
  }

  updateScore(incrementAmount = 1) {
    if (this.state !== GameState.PLAYING) {
      return;
    }

    this.stats.score += incrementAmount;

    this.updateGameSpeed();
  }

  resetScore() {
    this.stats.score = 0;
    this.stats.gameSpeed = GAME_CONFIG.initialSpeed;
    this.stats.timeElapsed = 0;
    this.lastUpdateTime = Date.now();
  }

  checkAndUpdateHighScore() {
    if (this.stats.score > this.stats.highScore) {
      this.stats.highScore = this.stats.score;
      localStorage.setItem("highScore", this.stats.highScore.toString());
    }
  }

  updateGameSpeed() {
    if (
      this.stats.score > 0 &&
      this.stats.score % GAME_CONFIG.speedIncrementScore === 0
    ) {
      this.stats.gameSpeed = Math.min(
        this.stats.gameSpeed + GAME_CONFIG.speedIncrement,
        GAME_CONFIG.maxSpeed
      );
    }
  }

  updateTime() {
    if (this.state !== GameState.PLAYING) return;

    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastUpdateTime;
    this.lastUpdateTime = currentTime;

    this.stats.timeElapsed += deltaTime;
  }

  getTimeElapsed() {
    return Math.floor(this.stats.timeElapsed / 1000);
  }

  startNewGame() {
    this.resetScore();
    this.setState(GameState.PLAYING);
  }

  endGame() {
    if (this.state === GameState.PLAYING) {
      this.setState(GameState.GAME_OVER);
    }
  }
}
