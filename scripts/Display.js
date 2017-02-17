var resizeFactor = 3;
var canvasSize = 300 * resizeFactor;
var boardLength = 250 * resizeFactor;
var padding = (canvasSize - boardLength) / 2;
var margin = 7 * resizeFactor;
var sizeOfText = 4 * resizeFactor;
var triWidth = 18 * resizeFactor;
var triHeight = 95 * resizeFactor;
var freeSpaceHeight = boardLength - 2 * triHeight;
var checkerDiameter = 18 * resizeFactor;
var checkerRadius = checkerDiameter / 2;
var brown, cream, black, white;
var borderWidth = 6 * resizeFactor;
var hbw = borderWidth / 2;
var rollButton;

var screenSize = {
  width: window.innerWidth || document.body.clientWidth,
  height: window.innerHeight || document.body.clientHeight
}


function setup() {
  createCanvas(canvasSize + 100, canvasSize);

  brown = color(60, 24, 24);
  cream = color(234, 199, 134)
  black = color(0, 0, 0);
  white = color(255, 255, 255);

  // these two functions are on server
  createTriangles();
  createCheckers();

  rollButton = createButton("Roll the dice!");
  rollButton.position(padding + borderWidth,
                      padding + boardLength/2);

  // roll is a function on server
  rollButton.mousePressed(roll);

  smooth();
}

function draw() {

  background(0);
  drawBoard();
  if (mouseY > padding && mouseY < padding + triHeight ||
      (mouseY > padding + triHeight + freeSpaceHeight &&
        mouseY < canvasSize - padding)) { highlightTriangles(); }


  if (isSelected && clickedTriangle > -1 &&
       checkerCanBeMovedTo(selectedChecker, clickedTriangle)) {
    highlightPossibleMoves(clickedTriangle);
  }

  drawCheckers();
}

function mousePressed() {
  // on server
  executeMouseCommand();
} // mousePressed

function updateCheckersCoordinates() {
  var newX, newY, s;
  for (var i = 0; i <= 25; i++) {
    s = i < 13? -1 : 1;
    for (var j = 0; j < triangles[i].checkersStack.length; j++) {
      newX = triangles[i].p3.x;
      newY = triangles[i].p1.y + s*(checkerRadius + j%5 * checkerDiameter);

      checkers[triangles[i].checkersStack[j]-1].center.x = newX;
      checkers[triangles[i].checkersStack[j]-1].center.y = newY;
    }
  }
}

function getHoveredTriangle() {
  // optimisation: only compute if mouse is over some triangle
  if (mouseY > padding + triHeight + freeSpaceHeight &&
      mouseY < canvasSize - padding) {
    for (var i = 0; i <= 12; i++) {
      if (collidePointRect(mouseX, mouseY,
        triangles[i].p2.x, triangles[i].p2.y - triHeight,
        triWidth, triHeight)) { return i; }
    }
  }
  else if (mouseY > padding && mouseY < padding + triHeight) {
    for (var i = 13; i <= 25; i++) {
      if (collidePointRect(mouseX, mouseY,
          triangles[i].p1.x, triangles[i].p1.y,
          triWidth, triHeight)) { return i; }
    } // for loop
  } // else if
  return -1;
} // getHoveredTriangle

function highlightPossibleMoves(tri) {
  for (var i = 0; i < triangles[tri].possibleTargets.length; i++) {
    highlightTriangle(triangles[tri].possibleTargets[i], color(0,255,0));
  }
}

function highlightTriangles() {
  var hoveredTri = getHoveredTriangle();
  if (hoveredTri > 0 && hoveredTri < 25) {
    highlightTriangle(hoveredTri, color(255,0,0));
  }
}

function highlightTriangle(tri, colour) {
  stroke(colour);
  strokeWeight(3);

  line(triangles[tri].p3.x, triangles[tri].p3.y,
       triangles[tri].p2.x, triangles[tri].p2.y);

  line(triangles[tri].p3.x, triangles[tri].p3.y,
       triangles[tri].p1.x, triangles[tri].p1.y);

}

function displayDiceOutcome() {
  textSize(30*resizeFactor);
  fill(255);
  noStroke();
  text(dice[0] + " " + dice[1],
       padding + borderWidth + boardLength/1.5, padding + boardLength/2 + 10*resizeFactor);

}

function drawBoard() {

  // board colour
  strokeWeight(0);
  fill(198, 160, 61);
  rect(padding, padding, boardLength + 18*resizeFactor + borderWidth, boardLength);

  // draw the triangles
  // triangles is an array of objects from the server
  for (var i = 0; i <= 25; i++)
  {
    triangles[i].display();
  }

  // borders
  drawBorders();

  // write the point
  writeNumbers();

  displayDiceOutcome();
}


function drawCheckers() {
  for (var i = 0; i < 30; i++) {
    // checkers is an array of objects from the server
    checkers[i].display();
  }

  // draw the number of checkers on each triangle
  textSize(sizeOfText);
  for (var i = 0; i <= 25; i++) {
    var s = i < 13? -1 : 1;
    var x = triangles[i].p3.x;
    var y = triangles[i].p1.y + s*checkerRadius;
    fill(255,0,0);
    text(triangles[i].checkersStack.length.toString(), x,y);
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
  // bottom
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
}

function writeNumbers() {
  textSize(sizeOfText);
  strokeWeight(0);
  fill(234, 199, 134);

  for (var i = 0; i <= 25; i ++)
  {
    text(i.toString(),
         i<9 ? triangles[i].p3.x - sizeOfText/4 : triangles[i].p3.x - sizeOfText/2,
         i<13? padding+boardLength+hbw*1.5 : padding-hbw*0.5);
  }
}


// THIS IS FOR SOCKET.IO CONNECTION TO THE NODE.JS SERVER

var socket;
