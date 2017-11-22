/**
 * Counts the amount of seconds between a starting event
 * and an ending event
 *
 * @author Christian Wang
 * @version 1.0
 */
class Timer {
  /**
   * Default constructor for timer object
   * Starts the timer
   */
  constructor() {
    this.mark();
  }

  /**
   * Starts the timer and sets the starttime value to current time
   */
  mark() {
    this.startTime = Date.now();
  }

  /**
   * Returns the amount of seconds that passed
   * Since the starting event
   */
  secondsElapsed() {
    return (Date.now() - this.startTime) / 1000;
  }

  /**
   * Returns the amount of millisecondss that passed
   * Since the starting event
   */
  millisecondsElapsed() {
    return Date.now() - this.startTime;
  }
}

class Actor {
  constructor() {
    this.width = 0;
    this.height = 0;
    this.x = 0;
    this.y = 0;
    this.world = null;

    this.shape = null;
  }

  setLocation(x, y) {
    this.x = x;
    this.y = y;
  }

  setShape(shape) {
    this.shape = shape;
  }

  act() {

  }
}

class World {
  constructor(canvas) {
    this.canvas = canvas;
    this.running = false;
    this.actors = [];
    this.background = null;

    this.timer = new Timer();
  }

  setBackground(background) {
    this.background = background;
  }

  start() {
    this.running = true;
    this.act();
  }

  stop() {
    this.running = false;
  }

  checkCollision(object1, object2) {
    if (object1.x < object2.x + object2.width && object1.x + object1.width > object2.x &&
      object1.y < object2.y + object2.height && object1.y + object1.height > object2.y) {
      return true;
    }
    return false;
  }

  updateGameArea() {
    let ctx = this.canvas.getContext("2d");
    this.background(ctx);
    this.actors.forEach(function(actor) {
      actor.act();
      actor.shape(ctx);
    });
  }

  act() {
    if (!this.running) return;
    window.requestAnimationFrame(this.act.bind(this));
    if (this.timer.millisecondsElapsed() > 17) {
      this.timer.mark();
      this.updateGameArea();
      this.act();
    }
  }

  addObject(actor, x, y) {
    this.actors.push(actor);
    actor.world = this;
    actor.setLocation(x, y);
  }

  removeObject(actor) {
    let i = this.actors.findIndex(a => (a.x === actor.x && a.y === actor.y));
    if (i != -1) {
      this.actors.splice(i, 1);
    }
    actor.world = null;
  }
}
