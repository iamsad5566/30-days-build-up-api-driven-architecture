export default class Timer {
  active = false;
  counter = 0;
  maxCount;
  callback = undefined;

  constructor(maxCount, callback = undefined) {
    this.maxCount = maxCount;
    if (callback) this.callback = callback;
  }

  reset() {
    this.counter = 0;
    this.active = true;
  }

  stop() {
    this.active = false;
  }

  update() {
    if (!active) {
      return false;
    }

    this.counter++;
    if (this.counter >= this.maxCount) {
      this.active = false;
      if (this.callback) {
        this.callback;
      }
      return true;
    }
    return false;
  }
}
