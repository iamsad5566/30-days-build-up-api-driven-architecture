import { GAME_CONFIG } from "./config";
import Player from "./entities/Player";
import EntityFactory from "./EntityFactory";
import GameRenderer from "./GameRender";
import GameStateManager, { GameState } from "./GameStateManager";

export default class Game {
  player;
  stairs;

  stateManager;
  entityFactory;
  renderer;

  canvas;
  context;

  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    // Init the services
    this.stateManager = new GameStateManager();
    this.entityFactory = new EntityFactory();
    this.renderer = new GameRenderer();

    // Init the entities
    this.player = new Player(0, 0);
    this.stairs = [];

    this.bindEvents();
    this.init();
  }

  init() {
    this.stateManager.setState(GameState.NOT_STARTED);

    this.entityFactory.resetIdCounter();

    this.stairs = this.entityFactory.createInitialStairs();

    this.player = this.entityFactory.createPlayerOnStair(this.stairs);

    this.ensureEnoughStairs();
  }

  bindEvents() {
    this.canvas.addEventListener("click", () => {
      this.handleCanvasClick();
    });
  }

  handleCanvasClick() {
    switch (this.stateManager.state) {
      case GameState.NOT_STARTED:
        this.init();
        this.stateManager.startNewGame();
        break;
      case GameState.GAME_OVER:
        this.init();
        this.stateManager.startNewGame();
        break;
      default:
        break;
    }
  }

  resetGame() {
    this.stateManager.resetScore();
    this.entityFactory.resetIdCounter();
    this.stairs = this.entityFactory.createInitialStairs();
    this.player = this.entityFactory.createPlayerOnStair(this.stairs);

    this.ensureEnoughStairs();
  }

  update(keysPressed) {
    this.stateManager.updateScore();
    this.stateManager.updateTime();
    this.updateEntities(keysPressed);
    this.checkGameConditions();
  }

  updateEntities(keysPressed) {
    const gameSpeed = this.stateManager.stats.gameSpeed;
    this.updateStairs(gameSpeed);

    this.player.update(keysPressed, this.stairs);
  }

  ensureEnoughStairs() {
    if (this.stairs.length === 0) return;

    const lowestStair = [...this.stairs].sort((a, b) => b.y - a.y)[0];

    if (lowestStair.y < GAME_CONFIG.canvasHeight + 5) {
      const stairsNeeded =
        Math.ceil(
          (GAME_CONFIG.canvasHeight + 5 - lowestStair.y) /
            GAME_CONFIG.stairSpacing
        ) + 2t
      for (let i = 0; i < stairsNeeded; i++) {
        this.addNewStair();
      }
    }
  }

  addNewStair() {
    if (this.stairs.length === 0) {
      this.stairs.push(
        this.entityFactory.createStair(Math.random() * GAME_CONFIG.canvasWidth)
      );
      return;
    }

    const lastStair = this.stairs[this.stairs.length - 1];
    const stairY = lastStair.y + GAME_CONFIG.stairSpacing;
    const stairX =
      Math.random() * (GAME_CONFIG.canvasHeight - GAME_CONFIG.stairWidth);
    const newStair = this.entityFactory.createStair(stairX, stairY);
    this.stairs.push(newStair);
  }

  updateStairs(gameSpeed) {
    this.stairs.forEach((stair) => stair.update(gameSpeed));
  }

  manageStairs() {
    this.stairs = this.stairs.filter((stair) => stair.y + stair.height > 0);
    this.ensureEnoughStairs();
  }

  checkGameConditions() {
    if (this.player.y <= 0) {
      this.handleTopCollision();
    }

    if (this.player.y >= GAME_CONFIG.canvasHeight + this.player.height) {
      this.stateManager.endGame();
      return;
    }

    if (this.player.health <= 0) {
      this.stateManager.endGame();
    }
  }

  handleTopCollision() {
    if (this.stateManager.stats.score > 50 && this.player.takeDamage()) {
      this.player.y = 5;
      this.player.velocity = -5;
    } else {
      this.player.y = 5;
      this.player.velocity = -3;
    }
  }

  render() {
    this.renderer.render(
      this.context,
      this.stateManager.state,
      this.player,
      this.stairs,
      this.stateManager.stats
    );
  }
}
