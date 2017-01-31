var resizeFactor = 3;
var canvasSize = 300 * resizeFactor;
var boardLength = 250 * resizeFactor;
var padding = (canvasSize - boardLength) / 2;
var margin = 7 * resizeFactor;
var borderWidth = 6 * resizeFactor;
var hbw = borderWidth / 2;

function setup() {
  createCanvas(canvasSize + 100, canvasSize);
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
