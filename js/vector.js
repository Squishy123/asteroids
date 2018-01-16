/**
 *  Vector Class
 * @author Kevin Pan
 * @version 1.0
 **/
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  set(v) {
    this.x = v.x;
    this.y = v.y;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
  }

  subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
  }

  scale(v) {
    this.x *= v.x;
    this.y *= v.y;
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // radians
  angle() {
    if (this.y == 0)
      return 0;
    else if (this.x > 0 && this.y > 0)
      return Math.atan(this.y / this.x);
    else if (this.x < 0 && this.y > 0)
      return Math.PI + Math.atan(this.y / this.x);
    else if (this.x < 0 && this.y < 0)
      return Math.PI + Math.atan(this.y / this.x);
    else
      return 2 * Math.PI + Math.atan(this.y / this.x);
  }
}
