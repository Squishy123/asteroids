class Vector{
  constructor(x, y){
    this.x=x;
    this.y=y;
  }

  add(v){
    this.x+=v.x;
    this.y+=v.y;
  }

  subtract(v){
    this.x-=v.x;
    this.y-=v.y;
  }

  magnitude(){
    return Math.sqrt(this.x*this.x+this.y*this.y);
  }
}
