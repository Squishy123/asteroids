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

  updateGameArea() {
    let context = this.canvas.getContext("2d");
    this.background(context);
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
    actor.world = this;
    actor.setLocation(x, y);
  }

  removeObject(actor) {
    actor.world = null;
    actors.filter(function(a) {
      return a != actor;
    });
  }
}

class Bullet extends Actor {
  constructor(angle) {
    super();
    this.angle = angle;

    console.log("Added Bullet")
    this.shape = function(ctx) {
      ctx.fillStyle = "blue";
      //ctx.rotate(angle);
      ctx.fillRect(this.x, this.y, 5, 5);
    }

  }

  act() {
    this.setLocation(this.x + (10 * Math.cos(this.angle)), this.y - (10 * Math.sin(this.angle)));
  }
}

class Player extends Actor {
  constructor() {
    super();
    this.width = 25;
    this.height = 25;

    this.MAX_VX = 5;
    this.MAX_VY = 5;
    this.vx = 0;
    this.vy = 0;
    this.a = 0.25;

    //shape
    this.color = "red";
    this.shape = function(ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.keys = [];

    //input handler
    let obj = this;
    document.addEventListener("keydown", function(event) {
      obj.keys[event.which] = true;
    });

    document.addEventListener("keyup", function(event) {
      obj.keys[event.which] = false;
    });
  }

  act() {
    if (this.keys[65]) {
      if (Math.abs(this.vx) > this.MAX_VX) {
        this.vx = -1 * this.MAX_VX + this.a;
      } else
        this.vx -= this.a;
    } else if (this.keys[68]) {
      if (Math.abs(this.vx) > this.MAX_VX)
        this.vx = this.MAX_VX - this.a;
      else
        this.vx += this.a
    }
    if (this.keys[87]) {
      if (Math.abs(this.vy) > this.MAX_VY)
        this.vy = -1 * this.MAX_VY + this.a;
      else
        this.vy -= this.a;
    } else if (this.keys[83]) {
      if (Math.abs(this.vy) > this.MAX_VY)
        this.vy = this.MAX_VY - this.a;
      else
        this.vy += this.a;
    }

    this.setLocation(this.x + this.vx, this.y + this.vy);

    if (this.keys[13])
      this.world.addObject(new Bullet(90 * Math.PI / 180), this.x, this.y);
  }
}

let myWorld = new World(document.getElementById("MyCanvas"));
myWorld.setBackground(function(ctx) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
});
myWorld.start();
myWorld.addObject(new Player(), 100, 100);
