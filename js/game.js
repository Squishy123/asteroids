class Asteroid extends CanvasActor {
  constructor(size) {
    super();
    this.size = size;
  }

  init() {
    super.init();
    this.setBounds({
      width: this.size,
      height: this.size
    });

    //set shape
    this.setShape((ctx) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, this.getBounds().width, this.getBounds().height);
    });

    this.angle = Math.random() * 100;
    this.vx = Math.sin(this.angle * Math.PI / 180);
    this.vy = Math.cos(this.angle * Math.PI / 180);
  }

  update() {
    super.update();
    if (this.world) {
      let l = this.world.actors.length;
      for (let i = 0; i < l; i++) {
        if (this.world.checkCollision(this, this.world.actors[i]) && this.world.actors[i] instanceof Particle) {
          if (this.size > 10) {
            this.world.addObject(new Asteroid(this.size / 2), this.x, this.y);
            this.world.addObject(new Asteroid(this.size / 2), this.x, this.y);
          }
          this.world.removeObject(this);
          return;
        }
      }

      this.setLocation(this.x + this.vx, this.y + this.vy);
    }
  }
}

<<<<<<< HEAD

class Particle extends CanvasActor {
  constructor(angle) {
    super();
    this.angle = angle;
    this.vx = -5 * Math.sin(this.angle * Math.PI / 180);
    this.vy = 5 * Math.cos(this.angle * Math.PI / 180);
    this.setBounds({
      width: 5,
      height: 5
    });
    this.lifetime = new Timer();
    this.shape = function(ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(this.getBounds().x, this.getBounds().y, this.getBounds().width, this.getBounds().height);
    }

  }

  update() {
    //if (this.lifetime.millisecondsElapsed() > 1000) this.stage.removeObject(this);
    this.setBounds({
      x: this.x + this.vx,
      y: this.y + this.vy
    });
  }
}

=======
>>>>>>> parent of 9e9c80a... Added particles TODO fix
class Player extends CanvasActor {
  constructor() {
    super();
  }

  init() {
    super.init();
    this.setBounds({
      width: 25,
      height: 25
    });

    this.setShape(function(ctx) {
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

    });

    this.angle = 0;

    this.MAX_VX = 5;
    this.MAX_VY = 5;
    this.vx = 0;
    this.vy = 0;
    this.a = 0.25;

    this.inputHandler = new InputHandler();
    this.inputHandler.targetEvents(document, {
      keydown: true,
      keyup: true
    });
  }

  update() {
    super.update();
    //collision with Asteroid
    if (this.stage) {
      let l = this.stage.actors.length;
      for (let i = 0; i < l; i++) {
        if (this.stage.checkCollision(this, this.stage.actors[i]) && this.stage.actors[i] instanceof Asteroid) {
          this.stage.removeObject(this);
          return;
        }
      }

      if (this.inputHandler.keys[65]) {
        this.angle -= 10;
      } else if (this.inputHandler.keys[68]) {
        this.angle += 10;
      }

      if (this.inputHandler.keys[87]) {
        this.vx += 0.25 * Math.sin(this.angle * Math.PI / 180);
        this.vy -= 0.25 * Math.cos(this.angle * Math.PI / 180);
        //  this.stage.addObject(new Particle(this.angle), this.x, this.y);
      } else if (this.inputHandler.keys[83]) {
        //this.vx -= 0.25 * Math.sin(this.angle * Math.PI / 180);
        //this.vy += 0.25 * Math.cos(this.angle * Math.PI / 180);
      }
      this.setBounds({
        x: this.x + this.vx,
        y: this.y + this.vy
      });

      console.log(this.getBounds())
      //Wrap
      if (this.x < 0)
        this.setBounds({
          x: this.stage.getBounds().width,
          y: this.y
        });
      if (this.x > this.stage.getBounds().width)
        this.setBounds({
          x: 0,
          y: this.y
        });
      if (this.y < 0)
        this.setBounds({
          x: this.x,
          y: this.stage.getBounds().height
        });
      if (this.y > this.stage.getBounds().height)
        this.setBounds({
          x: this.x,
          y: 0
        });

      //if (this.inputHandler.keys[32])
      // /this.stage.addObject(new Bullet(this.angle), this.x, this.y);
      //this.stage.addObject(new Bullet(90 * Math.PI / 180), this.x, this.y);
    }
  }
}

class AsteroidWorld extends CanvasStage {
  constructor(canvas) {
    super(canvas);
    this.asteroidTimer = new Timer();
    this.score = 0;
    this.setBackground(function(ctx) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, this.getBounds().width, this.getBounds().height);
    });
  }


  removeObject(actor) {
    super.removeObject(actor);
    if (actor instanceof Asteroid) {
      this.score++;
      document.getElementById("score").innerHTML = `Score: ${this.score}`;
    } else if (actor instanceof Player) {
      document.getElementById("score").innerHTML += ` Game Over! Refresh to restart`;
      this.stop();
    }
  }

  update() {
    super.update();
    if (this.asteroidTimer.millisecondsElapsed() > 1000) {
      let rand = Math.floor(Math.random() * 4);
      if (rand === 0)
        this.addObject(new Asteroid(50), 0, Math.floor(Math.random() * this.getBounds().height));
      else if (rand === 1)
        this.addObject(new Asteroid(50), this.getBounds().width, Math.floor(Math.random() * this.getBounds().height));
      else if (rand === 2)
        this.addObject(new Asteroid(50), Math.floor(Math.random() * this.getBounds().width), 0);
      else if (rand === 3)
        this.addObject(new Asteroid(50), Math.floor(Math.random() * this.getBounds().width), this.getBounds().height);

      this.asteroidTimer.mark();
      console.log("Add asteroid")
    }
  }
}

let myWorld = new AsteroidWorld(document.getElementById("myCanvas"));
myWorld.start();
let player = new Player();
player.setBounds({x: 300, y: 300});
myWorld.addObject(player);
