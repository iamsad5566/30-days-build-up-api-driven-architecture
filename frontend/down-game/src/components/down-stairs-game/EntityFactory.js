import { GAME_CONFIG } from "./config";
import Player from "./entities/Player";
import Stair from "./entities/Stair";

export default class EntityFactory {
  // To manage the entities
  nextEntityId = 0;

  constructor() {
    this.reset;
  }

  resetIdCounter() {
    this.nextEntityId = 0;
  }

  createPlayerOnStair(stairs) {
    const topStairs = stairs.filter((stair) => stair.y < 200 && stair.y > 50);
    if (topStairs.length > 0) {
      const randomStair =
        topStairs[Math.floor(Math.random() * topStairs.length)];

      const player = new Player(
        randomStair.x + randomStair.width / 2 - GAME_CONFIG.playerWidth / 2,
        randomStair.y - GAME_CONFIG.playerHeight
      );

      player.y = Math.max(player.y, 20);
      player.setInitialInvincibility();
      return player;
    }

    const player = new Player(
      GAME_CONFIG.canvasWidth / 2 - GAME_CONFIG.playerWidth / 2,
      100
    );

    player.setInitialInvincibility();
    return player;
  }

  createPlayer() {}

  createStair(x, y, width = undefined) {
    return new Stair(this.nextEntityId++, x, y, width);
  }

  createInitialStairs() {
    let stairs = [];
    let stairsNeeded =
      Math.ceil(GAME_CONFIG.canvasHeight / GAME_CONFIG.stairSpacing) + 3;

    for (let i = 1; i < stairsNeeded; i++) {
      stairs.push(
        this.createStair(
          Math.random() * (GAME_CONFIG.canvasWidth - GAME_CONFIG.stairWidth),
          GAME_CONFIG.canvasHeight - i * GAME_CONFIG.stairSpacing - 50
        )
      );
    }
    return stairs;
  }
}
