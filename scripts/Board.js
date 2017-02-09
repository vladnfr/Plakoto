var resizeFactor = 3;
var canvasSize = 300 * resizeFactor;
var boardLength = 250 * resizeFactor;
var padding = (canvasSize - boardLength) / 2;
var margin = 7 * resizeFactor;
var borderWidth = 6 * resizeFactor;
var hbw = borderWidth / 2;

var triangles = [];
var triWidth = 18 * resizeFactor;
var triHeight = 95 * resizeFactor;

function setup() {
  createCanvas(canvasSize + 100, canvasSize);
  createTriangles();
}

function draw() {
  background(0);
  drawBoard();
}

function drawBoard() {

  strokeWeight(0);
  fill(198, 160, 61);
  rect(padding, padding, boardLength, boardLength);

  // borders
  drawBorders();

  // draw the triangles
  for (var i = 0; i < 24; i++)
  {
    triangles[i].display();
  }

} // drawBoard

function drawBorders() {

  stroke(84, 47, 13);
  strokeWeight(borderWidth);

  // left
  line(padding - hbw, padding - hbw,
       padding - hbw, padding + boardLength + hbw);
  // top
  line(padding - hbw, padding - hbw,
       padding + boardLength + hbw, padding - hbw);
  // right
  line(padding + boardLength + hbw, padding - hbw,
       padding + boardLength + hbw, padding + boardLength + hbw);
  // buttom
  line(padding - hbw, padding + boardLength + hbw,
       padding + boardLength + hbw, padding + boardLength + hbw);
  // middle line
  line(padding + boardLength/2, padding,
       padding + boardLength/2, padding + boardLength);
} // drawBorders

function createTriangles() {
  createTriangleSet(padding + boardLength - margin,
                        padding + boardLength, 0, -1);
  createTriangleSet(padding + boardLength/2 - hbw - margin,
                        padding + boardLength, 6, -1);
  createTriangleSet(padding + margin,
                        padding, 12, 1);
  createTriangleSet(padding + margin + boardLength/2 + hbw,
                        padding, 18, 1);
}

function createTriangleSet(x, y, index, s) {
  var halfTriWidth = triWidth / 2;
  var brown = color(60, 24, 24);
  var cream = color(234, 199, 134);

  for (var i = 0; i < 6; i++) {
    // add a new triangle with the computed coordinates and colour at
    // the correct index and alternate the colour of triangles
    triangles[i+index] = new BoardTriangle(createVector(x + s*i*triWidth, y),
                         createVector(x + s*(i+1)*triWidth, y),
                         createVector(x + s*halfTriWidth + s*i*triWidth, y + s*triHeight),
                         i%2==0? brown : cream);
  }
}
