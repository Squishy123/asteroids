class CanvasActor extends Actor {
  constructor() {
    super();
    this.shape = null;
  }

  setShape(shape) {
    this.shape = shape;
  }

  init() {
    super.init();
  }

  render() {
    super.render();
  }

  update() {
    super.update();
  }
}

class CanvasStage extends Stage {
  constructor(canvas) {
    super(canvas);
  }

  setBackground(background) {
    this.background = background;
  }

  update() {
    super.update();
    let ctx = this.element.getContext("2d");
    this.background(ctx);
    this.actors.forEach(function(actor) {
      actor.update();
      actor.shape(ctx);
    });
  }

  render() {
    super.render();
    let ctx = this.element.getContext("2d");
    this.background(ctx);
    this.actors.forEach(function(actor) {
      actor.render();
      actor.shape(ctx);
    });
  }
}
