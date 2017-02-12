var resizeFactor = 3;
var canvasSize = 300 * resizeFactor;
var boardLength = 250 * resizeFactor;
var padding = (canvasSize - boardLength) / 2;
var margin = 7 * resizeFactor;
var borderWidth = 6 * resizeFactor;
var hbw = borderWidth / 2;
var sizeOfText = 4 * resizeFactor;


var triWidth = 18 * resizeFactor;
var triHeight = 95 * resizeFactor;
var triangles = [];

var checkerDiameter = 18 * resizeFactor;
var checkerRadius = checkerDiameter / 2;
var checkers = [];

var freeSpaceHeight = boardLength - 2 * triHeight;
var brown, cream, black, white;

var hasRolled = false;
var dice = [0,0];
var currentPlayer = 0;
var sign = currentPlayer ? -1 : 1;
var selectedChecker = 0;
var isSelected = false;
var clickedTriangle = 0;



function setup() {
  brown = color(60, 24, 24);
  cream = color(234, 199, 134)
  black = color(0, 0, 0);
  white = color(255, 255, 255);

  createCanvas(canvasSize + 100, canvasSize);
  createTriangles();
  createCheckers();

  rollButton = createButton("Roll the dice!");
  rollButton.position(padding + borderWidth,
                      padding + boardLength/2);

  rollButton.mousePressed(roll);
}

function draw() {
  background(0);
  drawBoard();

  if (mouseY > padding && mouseY < padding + triHeight ||
      (mouseY > padding + triHeight + freeSpaceHeight &&
        mouseY < canvasSize - padding)) { highlightTriangles(); }


  drawCheckers();
}

function mousePressed() {
  // optimisation: only if over the triangles
  if (mouseY > padding && mouseY < padding + triHeight ||
      (mouseY > padding + triHeight + freeSpaceHeight &&
        mouseY < canvasSize - padding)) {
    clickedTriangle = getHoveredTriangle();
    if (clickedTriangle > -1 && totalValue > 0) {
      if (!isSelected) {
        if (currentPlayerCanGrabFrom(clickedTriangle)) {
          updatePossibleMoves();
          if (triangles[clickedTriangle].checkersStack.length > 0) {
            selectedChecker = triangles[clickedTriangle].checkersStack.pop();
            isSelected = true;
          } // if
        }
      } // if the checker is not selected
      else {
        if (checkerCanBeMovedTo(selectedChecker, clickedTriangle)) {
          var movedValue = clickedTriangle-checkers[selectedChecker-1].position;
          if (sign*movedValue >= 0) {
            moveChecker(selectedChecker, clickedTriangle);
            isSelected = false;
          } // legal move
        }
      } // if the checker is already selected
    } // if
  } // if mouse over the triangles
} // mousePressed

function moveChecker(checker, point) {

  if (point == 25 || point == 0) {
    if (totalValue == dice[0]) {
      totalValue = 0;
    }
    else if (totalValue == dice[1]) {
      totalValue = 0;
    }
    else {
      var previousTriangle = checkers[checker-1].position;
      if (dice[0] == previousTriangle || dice[0] == 25 - previousTriangle ) {
        totalValue -= dice[0];
      }
      else if (dice[1] == previousTriangle || dice[1] == 25 - previousTriangle){
        totalValue -= dice[1];
      }
      else {
        if (dice[0] > dice[1]) { totalValue -= dice[0]; }
        else                   { totalValue -= dice[1]; }
      }
    }
  } else {
    sign = currentPlayer? -1 : 1;
    totalValue -= sign*(point - checkers[checker-1].position);
  }
  triangles[point].checkersStack.push(checker);
  checkers[checker-1].position = point;

  updatePossibleMoves();
  updateCheckersCoordinates();
}

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

function roll() {
  if (!hasRolled) {
    hasRolled = true;
    isDouble = false;
    dice[0] = ceil(random() * 6);
    dice[1] = ceil(random() * 6);
    if (dice[0] == dice[1]) { isDouble = true; }

    totalValue = dice[0] != dice[1] ? dice[0] + dice[1] : dice[0]*4;
    updatePossibleMoves();
  }
}

function updatePossibleMoves() {
  var noOfTargets;
  var target;
  var isPossibleToMove = false;
  canBearOff = canCurrentPlayerBearOff();

  // reset all the possible targets
  for (var i = 0; i <= 25; i++) {
    if (triangles[i].checkersStack.length) {
      triangles[i].possibleTargets = [i];
    }
  }

  for (var i = 1; i <= 24; i++) {
    if (currentPlayerCanMoveFrom(i)) {
    // compute which are the possible targets you can move to
      if (!isDouble) {
        noOfTargets = totalValue == dice[0] + dice[1] ? 3 : 1;
        if (noOfTargets == 1) {
          if (totalValue == dice[1]) {
            target = i + sign*dice[1];
            if (target > 0 && target < 25)  {
              if (currentPlayerCanMoveTo(target)) {
                 triangles[i].possibleTargets.push(target);
                 isPossibleToMove = true;
              } // valid move
            } // if it's not the case of bearing off
            else if (canBearOff) {
              bearOff();
              isPossibleToMove = true;
            } // checker can be bourne off
          } // if first die already moved

          else {
            target = i + sign*dice[0];
            if (target > 0 && target < 25) {
              if (currentPlayerCanMoveTo(target)) {
                 triangles[i].possibleTargets.push(target);
                 isPossibleToMove = true;
              } // valid move
            } // if it's not the case of bearing off
            else if (canBearOff) {
              bearOff();
              isPossibleToMove = true;
            } // checker can be bourne off
          } // if second die already moved
        } // if just one move left

        // in the case that no dice was already moved
        else {
          target = i + sign*dice[0];
          if (target > 0 && target < 25) {
            if (currentPlayerCanMoveTo(target)) {
              triangles[i].possibleTargets.push(target);
              isPossibleToMove = true;
            } // valid move
          } // if it's not the case of bearing off
          else if (canBearOff) {
            bearOff();
            isPossibleToMove = true;
          } // checker can be bourne off

          target = i + sign*dice[1];
          if (target > 0 && target < 25) {
            if (currentPlayerCanMoveTo(target)) {
              triangles[i].possibleTargets.push(target);
              isPossibleToMove = true;
            } // valid move
          } // if it's not the case of bearing off
          else if (canBearOff) {
            bearOff();
            isPossibleToMove = true;
          } // checker can be bourne off

          if (triangles[i].possibleTargets.length > 0) {
            target = i + sign*(dice[0] + dice[1]);
            if (target > 0 && target < 25) {
              if (currentPlayerCanMoveTo(target)
                   && triangles[i].possibleTargets.length > 1) {
                triangles[i].possibleTargets.push(target);
                isPossibleToMove = true;
              } // valid move
            } // if it's not the case of bearing off
            else if (canBearOff) {
              bearOff();
              isPossibleToMove = true;
            } // checker can be bourne off
          } // if the sum of dice is a valid move
        } // if no dice already moved
      } // if it's not a double

        else {
          noOfTargets = totalValue / dice[0];
          for (var j = 0; j < noOfTargets; j++) {
            target = i + sign*((j+1)*dice[0]);
            if (target > 0 && target < 25) {
              if (currentPlayerCanMoveTo(target)
                   && triangles[i].possibleTargets.length > j)  {
                triangles[i].possibleTargets.push(target);
                isPossibleToMove = true;
              } // valid move
            } // if it's not the case of bearing off
            else if (canBearOff) {
              bearOff();
              isPossibleToMove = true;
            } // checker can be bourne off
          } // for each possible target
        } // if it's a double
      } // if current player can move from this triangle
    } // for each triangle

  if (!isPossibleToMove) { totalValue = 0; }
  if (totalValue == 0) {
    currentPlayer = !currentPlayer;
    hasRolled = false;
    sign = currentPlayer ? -1 : 1;
  }
}

function currentPlayerCanMoveFrom(tri) {
  if (triangles[tri].checkersStack.length == 0) { return false; }

  var lastCheckerOnTriangle =
    triangles[tri].checkersStack[triangles[tri].checkersStack.length-1];

  if (currentPlayer == 0) {
    if (lastCheckerOnTriangle < 16) { return true; }
    else { return false; }
  }
  else {
    if (lastCheckerOnTriangle > 15) { return true; }
    else { return false; }
  }
}

function currentPlayerCanMoveTo(tri) {
  var lastCheckerOnTarget =
    triangles[tri].checkersStack[triangles[tri].checkersStack.length-1];

  if (triangles[tri].checkersStack.length > 1) {
    if (currentPlayer == 0) {
      if (lastCheckerOnTarget > 15) { return false; }
    }
    else {
      if (lastCheckerOnTarget < 16) { return false; }
    }
  }
  return true;
}

function canCurrentPlayerBearOff() {
  if (currentPlayer == 0) {
    for (var i = 0; i < 15; i++) {
      if (checkers[i].position < 19) {
        return false;
      }
    }
  }
  else {
    for (var i = 15; i < 30; i++) {
      if (checkers[i].position > 6) {
        return false;
      }
    }
  }
  return true;
}

function currentPlayerCanGrabFrom(t) {
  if (currentPlayer == 0) {
    return triangles[t].checkersStack[triangles[t].checkersStack.length-1] < 16
      || triangles[t].checkersStack.length == 0;
  }
  else {
    return triangles[t].checkersStack[triangles[t].checkersStack.length-1] > 15
      || triangles[t].checkersStack.length == 0;
  }
}

function checkerCanBeMovedTo(checker, tri) {
  for (var i = 0; i < triangles[checkers[checker-1].position].possibleTargets.length; i++) {
    if (tri == triangles[checkers[checker-1].position].possibleTargets[i]) {
      return true;
    }
  }
  return false;
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

  writeNumbers();
  displayDiceOutcome();
} // drawBoard

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

function displayDiceOutcome() {
  textSize(30*resizeFactor);
  fill(255);
  noStroke();
  text(dice[0] + " " + dice[1],
       padding + borderWidth + boardLength/1.5, padding + boardLength/2 + 10*resizeFactor);

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
