class Particle extends Actor {
  constructor(angle) {
    super();
    this.angle = angle;
    this.vx = -5 * Math.sin(this.angle * Math.PI / 180);
    this.vy = 5 * Math.cos(this.angle * Math.PI / 180);
    this.width = 5;
    this.height = 5;
    this.lifetime = new Timer();
    this.shape = function(ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

  }

  act() {
    if (this.lifetime.millisecondsElapsed() > 1000) this.world.removeObject(this);
    this.setLocation(this.x + this.vx, this.y + this.vy);
  }
}

class Bullet extends Actor {
  constructor(angle) {
    super();
    this.angle = angle;
    this.vx = 10 * Math.sin(this.angle * Math.PI / 180);
    this.vy = -10 * Math.cos(this.angle * Math.PI / 180);
    this.width = 5;
    this.height = 5;
    this.lifetime = new Timer();
    this.shape = function(ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

  }

  act() {
    if (this.lifetime.millisecondsElapsed() > 5000) this.world.removeObject(this);
    this.setLocation(this.x + this.vx, this.y + this.vy);
  }
}

class Asteroid extends Actor {
  constructor(size) {
    super();
    this.width = size;
    this.height = size;
    this.angle = Math.random() * 100;
    this.vx = Math.sin(this.angle * Math.PI / 180);
    this.vy = Math.cos(this.angle * Math.PI / 180);

    this.shape = function(ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  act() {
    if (this.world) {
      let l = this.world.actors.length;
      for (let i = 0; i < l; i++) {
        if (this.world.checkCollision(this, this.world.actors[i]) && this.world.actors[i] instanceof Particle) {
          this.world.removeObject(this);
          return;
        }
      }

      this.setLocation(this.x + this.vx, this.y + this.vy);
    }
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
      ctx.translate(this.x + this.vx, this.y + this.vy);
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
    //collision with Asteroid
    if (this.world) {
      let l = this.world.actors.length;
      for (let i = 0; i < l; i++) {
        if (this.world.checkCollision(this, this.world.actors[i]) && this.world.actors[i] instanceof Asteroid) {
          this.world.removeObject(this);
          return;
        }
      }

      if (this.keys[65]) {
        this.angle -= 10;
      } else if (this.keys[68]) {
        this.angle += 10;
      }

      if (this.keys[87]) {
        this.vx += 0.25 * Math.sin(this.angle * Math.PI / 180);
        this.vy -= 0.25 * Math.cos(this.angle * Math.PI / 180);
        this.world.addObject(new Particle(this.angle), this.x, this.y);
      } else if (this.keys[83]) {
        //this.vx -= 0.25 * Math.sin(this.angle * Math.PI / 180);
        //this.vy += 0.25 * Math.cos(this.angle * Math.PI / 180);
      }
      this.setLocation(this.x + this.vx, this.y + this.vy);


      //Wrap
      if (this.x < 0)
        this.setLocation(this.world.canvas.width, this.y);
      if (this.x > this.world.canvas.width)
        this.setLocation(0, this.y);
      if (this.y < 0)
        this.setLocation(this.x, this.world.canvas.height);
      if (this.y > this.world.canvas.height)
        this.setLocation(this.x, 0);

      //if (this.keys[32])
        // /this.world.addObject(new Bullet(this.angle), this.x, this.y);
      //this.world.addObject(new Bullet(90 * Math.PI / 180), this.x, this.y);
    }
  }
}

class MyWorld extends World {
  constructor(element) {
    super(element);
    this.asteroidTimer = new Timer();
    this.score = 0;
    this.setBackground(function(ctx) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    });
  }

  removeObject(actor) {
    super.removeObject(actor);
    if (actor instanceof Asteroid) {
      this.score++;
      document.getElementById("score").innerHTML = `Score: ${this.score}`;
    } else if (actor instanceof Player) {
      document.getElementById("score").innerHTML = `Game Over! Refresh to restart`;
      this.stop();
    }
  }

  act() {
    super.act();
    if (this.asteroidTimer.millisecondsElapsed() > 1000) {
      let rand = Math.floor(Math.random() * 4);
      if (rand === 0)
        this.addObject(new Asteroid(50), 0, Math.floor(Math.random() * this.canvas.height));
      else if (rand === 1)
        this.addObject(new Asteroid(50), this.canvas.width, Math.floor(Math.random() * this.canvas.height));
      else if (rand === 2)
        this.addObject(new Asteroid(50), Math.floor(Math.random() * this.canvas.width), 0);
      else if (rand === 3)
        this.addObject(new Asteroid(50), Math.floor(Math.random() * this.canvas.width), this.canvas.height);

      this.asteroidTimer.mark();
      console.log("Add asteroid")
    }
  }
}

let myWorld = new MyWorld(document.getElementById("MyCanvas"));
myWorld.start();
myWorld.addObject(new Player(), 100, 100);
