// random color hexadecimal as string
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function deg_to_rad(degrees) {
  return degrees*(Math.PI/180);
}

function getDistance(a, b){
  return Math.sqrt((b.x-a.x)*(b.x-a.x)+(b.y-a.y)*(b.y-a.y));
}

// return acute angle relative from the y axis
function normalangle(v){
    return Math.abs((Math.atan(v.x/v.y)*180/Math.PI));
}


class Particle extends Actor {
  constructor(angle,color) {
    super();
    this.angle = angle;
    this.vx = -5 * Math.sin(this.angle * Math.PI / 180);
    this.vy = 5 * Math.cos(this.angle * Math.PI / 180);
    this.width = 5;
    this.height = 5;
    this.lifetime = new Timer();
    this.shape = function(ctx) {
      ctx.fillStyle = color;
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
    //this.v = new Vector(10 * Math.sin(this.angle * Math.PI / 180), -10 * Math.cos(this.angle * Math.PI / 180));
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
  constructor(size,x,y) {
    super();
    this.size = size;
    this.width = size;
    this.height = size;
    this.mass = size*size*size*4/3*Math.PI;
    this.angle = Math.random()*2*Math.PI;
    this.p = new Vector(x,y);
    this.v = new Vector(Math.cos(this.angle),Math.sin(this.angle));
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
          if (this.size > 10) {
            this.world.addObject(new Asteroid(this.size / 2,this.x,this.y), this.x, this.y);
            this.world.addObject(new Asteroid(this.size / 2,this.x,this.y), this.x, this.y);
          }
          this.world.removeObject(this);
          return;
        }
      }

      this.p.add(this.v);
      this.setLocation(this.p.x, this.p.y);
    }
  }
}

class Player extends Actor {
  constructor(x,y) {
    super();
    this.width = 25;
    this.height = 25;
    this.angle = 0;
    this.mass = 25*25*25*4/3*Math.PI;

    this.MAX_V = 15;
    this.MAX_VX = 5;
    this.MAX_VY = 5;
    this.MAX_A = 0.25;
    this.p = new Vector(x,y);
    this.v = new Vector(0,0);
    this.a = new Vector(0,0);

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
      ctx.translate(this.x + this.v.x, this.y + this.v.y);
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
        this.a.add(new Vector(0.0015 * Math.sin(deg_to_rad(this.angle)), -0.0015 * Math.cos(deg_to_rad(this.angle))));
        /*if(this.v.magnitude()>this.MAX_V){
          this.v.subtract(new Vector(0.15 * Math.sin(deg_to_rad(this.angle)), -0.15 * Math.cos(deg_to_rad(this.angle))));
        }*/
        this.world.addObject(new Particle(this.angle, getRandomColor()), this.x, this.y);
      } else if (this.keys[83]) {
        //this.vx -= 0.25 * Math.sin(this.angle * Math.PI / 180); edit
        //this.vy += 0.25 * Math.cos(this.angle * Math.PI / 180); edit
      }

      this.v.add(this.a);
      this.p.add(this.v);
      this.setLocation(this.p.x, this.p.y);

      //Wrap
      if (this.x < 0){
        this.p.set(new Vector(this.world.canvas.width, this.y));
        this.setLocation(this.world.canvas.width, this.y);
      }if (this.x > this.world.canvas.width){
        this.setLocation(0, this.y);
        this.p.set(new Vector(0, this.y));
      }if (this.y < 0){
        this.setLocation(this.x, this.world.canvas.height);
        this.p.set(new Vector(this.x, this.world.canvas.height));
      }if (this.y > this.world.canvas.height){
        this.setLocation(this.x, 0);
        this.p.set(new Vector(this.x, 0));
      }

      //if (this.keys[32])
      // /this.world.addObject(new Bullet(this.angle), this.x, this.y);
      //this.world.addObject(new Bullet(90 * Math.PI / 180), this.x, this.y);

      //display velocity
      document.getElementById("velocity").innerHTML="Velocity: "+this.v.magnitude().toFixed(2)+"m/s ";
      let dir=Math.round(normalangle(this.v));
      if(dir==0){
        if(this.v.y>0)
            document.getElementById("velocity").innerHTML+="S";
        else
            document.getElementById("velocity").innerHTML+="N";
      }else if(dir==90){
        if(this.v.x>0)
            document.getElementById("velocity").innerHTML+="E";
        else
            document.getElementById("velocity").innerHTML+="W";
      }
      else if(this.v.angle()>3/2*Math.PI) //Q1
        document.getElementById("velocity").innerHTML+="N"+dir+"E";
      else if(this.v.angle()>Math.PI) //Q2
        document.getElementById("velocity").innerHTML+="N"+dir+"W";
      else if(this.v.angle()>1/2*Math.PI) //Q3
        document.getElementById("velocity").innerHTML+="S"+dir+"W";
      else if(this.v.angle()>0)
        document.getElementById("velocity").innerHTML+="S"+dir+"E";

      //display acceleration
      document.getElementById("acceleration").innerHTML="Acceleration: "+this.a.magnitude().toFixed(2)+"m/s ";
      dir=Math.round(normalangle(this.a));
      if(dir==0){
        if(this.a.y>0)
            document.getElementById("acceleration").innerHTML+="S";
        else
            document.getElementById("acceleration").innerHTML+="N";
      }else if(dir==90){
        if(this.a.x>0)
            document.getElementById("acceleration").innerHTML+="E";
        else
            document.getElementById("acceleration").innerHTML+="W";
      }
      else if(this.a.angle()>3/2*Math.PI) //Q1
        document.getElementById("acceleration").innerHTML+="N"+dir+"E";
      else if(this.a.angle()>Math.PI) //Q2
        document.getElementById("acceleration").innerHTML+="N"+dir+"W";
      else if(this.a.angle()>1/2*Math.PI) //Q3
        document.getElementById("acceleration").innerHTML+="S"+dir+"W";
      else if(this.a.angle()>0)
        document.getElementById("acceleration").innerHTML+="S"+dir+"E";
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
      document.getElementById("score").innerHTML += ` Game Over! Refresh to restart`;
      this.stop();
    }
  }

  act() {
    super.act();
    if (this.asteroidTimer.millisecondsElapsed() > 1000) {
      let rand = Math.floor(Math.random() * 4);
      if (rand === 0) {
        this.addObject(new Asteroid(50,0, Math.floor(Math.random() * this.canvas.height)), 0, Math.floor(Math.random() * this.canvas.height));
      }else if (rand === 1){
        this.addObject(new Asteroid(50,this.canvas.width, Math.floor(Math.random() * this.canvas.height)), this.canvas.width, Math.floor(Math.random() * this.canvas.height));
      }else if (rand === 2){
        this.addObject(new Asteroid(50,Math.floor(Math.random() * this.canvas.width), 0), Math.floor(Math.random() * this.canvas.width), 0);
      }else if (rand === 3){
        this.addObject(new Asteroid(50,Math.floor(Math.random() * this.canvas.width), this.canvas.height), Math.floor(Math.random() * this.canvas.width), this.canvas.height);
      }
      this.asteroidTimer.mark();
      console.log("Add asteroid")
    }

    // gravity
    for(var a in this.actors){
      if(this.actors[a] instanceof Player) {
        for(var b in this.actors){
          if(this.actors[b] instanceof Asteroid){
            var c = 0.000000000000667*this.actors[a].mass*this.actors[b].mass/Math.pow(getDistance(this.actors[a],this.actors[b]),2);
            if(isNaN(c)==false){
              var d = new Vector(this.actors[a].p.x,-1*this.actors[a].p.y);
              var e = new Vector(this.actors[b].p.x,-1*this.actors[b].p.y);
              e.subtract(d);
              var f = e.angle();
              this.actors[a].a.add(new Vector(Math.cos(f)*c,-1*Math.sin(f)*c));
            }
          }
        }
      }
    }
  }
}

let myWorld = new MyWorld(document.getElementById("MyCanvas"));
myWorld.start();
myWorld.addObject(new Player(myWorld.canvas.width/2, myWorld.canvas.height/2), myWorld.canvas.widtht/2, myWorld.canvas.height/2);
