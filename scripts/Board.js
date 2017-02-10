var resizeFactor = 3;
var canvasSize = 300 * resizeFactor;
var boardLength = 250 * resizeFactor;
var padding = (canvasSize - boardLength) / 2;
var margin = 7 * resizeFactor;
var borderWidth = 6 * resizeFactor;
var hbw = borderWidth / 2;

var triWidth = 18 * resizeFactor;
var triHeight = 95 * resizeFactor;
var triangles = [];

var checkerDiameter = 18 * resizeFactor;
var checkerRadius = checkerDiameter / 2;
var checkers = [];

var brown, cream, black, white;


function setup() {
  brown = color(60, 24, 24);
  cream = color(234, 199, 134)
  black = color(0, 0, 0);
  white = color(255, 255, 255);

  createCanvas(canvasSize + 100, canvasSize);
  createTriangles();
  createCheckers();
}

function draw() {
  background(0);
  drawBoard();
  drawCheckers();
}

function drawBoard() {

  strokeWeight(0);
  fill(198, 160, 61);
  rect(padding, padding, boardLength + 18*resizeFactor + borderWidth, boardLength);

  // borders
  drawBorders();

  // draw the triangles
  for (var i = 0; i <= 25; i++)
  {
    triangles[i].display();
  }

} // drawBoard

function drawCheckers() {
  for (var i = 0; i < 30; i++) {
    // checkers is an array of objects from the server
    checkers[i].display();
  }
}

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

       // bear off top
       line(padding + boardLength + hbw,
            padding - hbw,
            padding + boardLength + borderWidth + checkerDiameter + hbw,
            padding - hbw);

       // bear off right
       line(padding + boardLength + borderWidth + checkerDiameter + hbw,
            padding - hbw,
            padding + boardLength + borderWidth + checkerDiameter + hbw,
            padding + hbw + boardLength);

       // bear off bottom
       line(padding + boardLength + hbw,
            padding + boardLength + hbw,
            padding + boardLength + borderWidth + checkerDiameter + hbw,
            padding + hbw + boardLength);
} // drawBorders

function createTriangles() {
  triangles[0] = new BoardTriangle(createVector(padding+boardLength+borderWidth+triWidth, padding+boardLength),
                                   createVector(padding+boardLength+borderWidth, padding+boardLength),
                                   createVector(padding+boardLength+checkerRadius+borderWidth, padding+boardLength-triHeight),
                                   color(60, 24, 24));

  triangles[25] = new BoardTriangle(createVector(padding+boardLength+borderWidth, padding),
                                    createVector(padding+boardLength+borderWidth+triWidth, padding),
                                    createVector(padding+boardLength+checkerRadius+borderWidth, padding+triHeight),
                                    color(234, 199, 134));

  createTriangleSet(padding + boardLength - margin + triWidth,
                    padding + boardLength, 0, -1);
  createTriangleSet(padding + boardLength/2 - hbw - margin + triWidth,
                    padding + boardLength, 6, -1);
  createTriangleSet(padding + margin - triWidth,
                    padding, 12, 1);
  createTriangleSet(padding + margin + boardLength/2 + hbw - triWidth,
                    padding, 18, 1);
}

function createTriangleSet(x, y, index, s) {

  for (var i = 1; i <= 6; i++) {
    // add a new triangle with the computed coordinates and colour at
    // the correct index and alternate the colour of triangles
    triangles[i+index] = new BoardTriangle(createVector(x + s*i*triWidth, y),
                         createVector(x + s*(i+1)*triWidth, y),
                         createVector(x + s*checkerRadius + s*i*triWidth, y + s*triHeight),
                         i%2==0? brown : cream);
  }
}

function createCheckers() {

  triangles[1].checkersStack = new Array(15,14,13,12,11,10,9,8,7,6,5,4,3,2,1);
  triangles[24].checkersStack = new Array(30,29,28,27,26,25,24,23,22,21,20,19,18,17,16);

  for (var i = 0; i < 30; i++) {
    if (i < 15) {
      checkers[i] = new Checker(createVector(triangles[1].p3.x,
                                          triangles[1].p1.y - checkerRadius
                                           - (i%5) * checkerDiameter),
                                          white, 1);
    } else {
      checkers[i] = new Checker(createVector(triangles[24].p3.x,
                                          triangles[24].p1.y + checkerRadius
                                          + (i%5) * checkerDiameter),
                                          black, 24);
    } // else
  } // for
} // createCheckers
