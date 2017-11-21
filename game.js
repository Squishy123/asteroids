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

    this.timer = new Timer();
  }

  start() {
    this.running = true;
    this.act();
  }

  stop() {
    this.running = false;
  }

  updateGameArea() {
    let context = this.canvas.getContext("2d");
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.actors.forEach(function(actor) {
      actor.act();
      actor.shape(context);
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
    actor.setLocation(x, y);
  }

  removeObject(actor) {
    actor.world = null;
    actors.filter(function(a) {
      return a != actor;
    });
  }
}

class Square extends Actor {
  constructor() {
    super();
    this.width = 50;
    this.height = 50;
    this.color = "red";
    this.shape = function(ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  act() {
    this.setLocation(this.x+5, this.y);
  }
}

let myWorld = new World(document.getElementById("MyCanvas"));
myWorld.start();
myWorld.addObject(new Square, 100, 100);
