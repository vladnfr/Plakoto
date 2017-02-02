function BoardTriangle(p1, p2, p3, colour) {
  this.p1 = p1;
  this.p2 = p2;
  this.p3 = p3;
  this.colour = colour;
  this.checkersStack = [];
  this.possibleTargets = [];
  this.display = function() {
    fill(colour);
    strokeWeight(0);
    smooth();
    triangle(this.p1.x, this.p1.y, this.p2.x, this.p2.y, this.p3.x, this.p3.y);
  }
}
