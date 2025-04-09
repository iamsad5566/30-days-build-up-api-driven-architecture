import { GAME_CONFIG } from "../config";
import Entity from "./Entity";

export default class Stair extends Entity {
  id;

  constructor(id, x, y, width) {
    super(x, y, width || GAME_CONFIG.stairWidth, GAME_CONFIG.stairHeight);
    this.id = id;
  }

  update(gameSpeed) {
    this.y -= gameSpeed;
  }

  render(ctx) {
    ctx.fillStyle = "#8B4513"; // 棕色
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
