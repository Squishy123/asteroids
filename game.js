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
      ctx.save();
      //ctx.rotate(angle);
      ctx.fillRect(this.x, this.y, 5, 5);
      ctx.restore();
    }

  }

  act() {
    if (this.x > this.world.canvas.width || this.x < 0 || this.y > this.world.canvas.height || this.y < 0) this.world.removeObject(this);
    this.setLocation(this.x + (10 * Math.cos(this.angle)), this.y - (10 * Math.sin(this.angle)));
  }
}

class Player extends Actor {
  constructor() {
    super();
    this.width = 25;
    this.height = 25;
    this.angle = 0;

    this.MAX_VX = 5;
    this.MAX_VY = 5;
    this.vx = 0;
    this.vy = 0;
    this.a = 0.25;

    //shape
    this.color = "red";
    this.shape = function(ctx) {
      ctx.fillStyle = this.color;
      /**
      ctx.save();
      ctx.beginPath();
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate(this.angle * Math.PI / 180);
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      ctx.restore();
      **/
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle * Math.PI / 180);
      ctx.strokeStyle = '#ffffff';
      ctx.fillStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.lineTo(10, 10);
      ctx.lineTo(5, 7);
      ctx.lineTo(-5, 7);
      ctx.lineTo(-10, 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
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
      this.angle -= 10;
    } else if (this.keys[68]) {
      this.angle += 10;
    }

    //this.vx = 5 * Math.cos(this.angle * Math.PI / 180);
    //this.vy = 5 * Math.sin(this.angle * Math.PI / 180);

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
