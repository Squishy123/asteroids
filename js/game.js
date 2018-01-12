class GameActor extends Actor {
  constructor(element) {
    super(element);
  }

  preload() {
    this.styleElement({
      'position': 'absolute'
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
      'width': 0,
      'height': 0,
      'border-bottom': '40px solid #FFF',
      'border-left': '20px solid transparent',
      'border-right': '20px solid transparent'
    });

    this.added = 0;
  }

  update() {
    this.added++;
    this.setBounds({
      rotation: this.added
    })
  }
}

let stage = new Stage(document.querySelector('#stage'));
stage.start(60, 60);

stage.addActor(new Player(), {
  x: 100,
  y: 100
});
