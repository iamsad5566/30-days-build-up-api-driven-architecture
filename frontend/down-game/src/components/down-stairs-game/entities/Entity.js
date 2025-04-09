export default class Entity {
  x;
  y;
  width;
  height;

  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  // 畫面刷新處理
  update(...args) {}

  // 渲染處理
  render(ctx) {}
}
