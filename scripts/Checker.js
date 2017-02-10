function Checker(p, colour, initialPos) {
  this.center = p;
  this.colour = colour;
  //
  this.position = initialPos;
  //
  this.display = function() {
    fill(colour);
    strokeWeight(0);
    smooth();
    ellipse(this.center.x, this.center.y, checkerDiameter);
  }
}
