export const GAME_CONFIG = {
  canvasWidth: 400,
  canvasHeight: 600,
  stairWidth: 100,
  stairHeight: 20,
  playerWidth: 30,
  playerHeight: 40,
  initialSpeed: 1,
  maxSpeed: 8,
  speedIncrement: 0.1,
  speedIncrementScore: 500,
  playerMoveStep: 10,
  gravity: 0.2,
  stairSpacing: 100, // 階梯間距
  initialHealth: 3, // 初始血量
  invincibleTime: 60, // 無敵時間（幀數）
  healthBarWidth: 100,
  healthBarHeight: 15,
  healthBarPadding: 5,
  minStairCount: 8, // 畫面上的最小階梯數量
  stairDensity: 1.5, // 階梯密度係數（值越大，階梯越密集）
};

export const ScoreLevel = {
  LOW: 1000,
  MEDIUM: 2000,
  HIGH: 4000,
};
