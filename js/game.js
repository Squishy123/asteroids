class GameActor extends Actor {
  constructor(element) {
    super(element);
    this.preload();
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    this.MAX_VELOCITY = 1;
  }

  preload() {
    this.styleElement({
      'position': 'absolute'
    });
  }

  addForce(v) {
      let mod = new Vector(v.x, v.y);
      if(Math.abs(v.x) > this.MAX_VELOCITY) mod.x = 0;
      if(Math.abs(v.y) > this.MAX_VELOCITY) mod.y = 0;

      this.acceleration.add(v);
      this.calculatePosition();
  }

  calculatePosition() {
    let mod = new Vector(this.acceleration.x, this.acceleration.y);
    if(Math.abs(this.velocity.x) > this.MAX_VELOCITY) mod.x = 0;
    if(Math.abs(this.velocity.y) > this.MAX_VELOCITY) mod.y = 0;
    this.velocity.add(mod);

    this.setBounds({
      x: this.x + this.velocity.x,
      y: this.y + this.velocity.y
    });
  }
  //Added rotation to bounds
  setBounds(bounds) {
    super.setBounds(bounds);
    if (bounds.rotation)
      this.styleElement({
        "-ms-transform": `rotate(${bounds.rotation}deg)`,
        "-webkit-transform": `rotate(${bounds.rotation}deg)`,
        "transform": `rotate(${bounds.rotation}deg)`
      });
  }
}

class Player extends GameActor {
  constructor() {
    super(document.createElement('div'));
  }

  preload() {
    //add shape
    this.styleElement({
      'position': 'absolute',
      'background-color': '#FFF'
    });

    this.setBounds({
      width: 50,
      height: 50
    });

    this.input = new InputHandler();
    this.input.targetEvents(document, {
      keydown: true,
      keyup: true
    });
  }

  update() {
    console.log(this.input.keys)
    //a
    if (this.input.keys[65]) {
      this.addForce(new Vector(-0.001, 0));
    } else if (this.input.keys[68]) {
      this.addForce(new Vector(0.001, 0));
    }
    //s
    if (this.input.keys[83]) {
      this.addForce(new Vector(0, 0.001));
    } else if (this.input.keys[87]) {
      this.addForce(new Vector(0, -0.001));
    }

    this.calculatePosition();
  }
}

let stage = new Stage(document.querySelector('#stage'));
stage.start(60, 60);

stage.addActor(new Player(), {
  x: 100,
  y: 100
});
