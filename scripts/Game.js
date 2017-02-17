var currentPlayer = 0;
var hasRolled = false;
var canBearOff = false;

// this is a list storing all the checker objects
var checkers = [];
var triangles = [];

// this is the list of 2 showing the dice outcome
var dice = [0,0];
var isDouble;
var totalValue = 0;

var selectedChecker = 0;
var isSelected = false;
var clickedTriangle = 0;
var sign = currentPlayer ? -1 : 1;


function executeMouseCommand() {
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
} // executeMouseCommand

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


function roll() {
  if (!hasRolled) {
    hasRolled = true;
    isDouble = false;
    dice[0] = ceil(random() * 6);
    dice[1] = ceil(random() * 6);
    if (dice[0] == dice[1]) { isDouble = true; }

    totalValue = dice[0] != dice[1] ? dice[0] + dice[1] : dice[0]*4;
    updatePossibleMoves();
    console.log(totalValue);
  }
}

function bearOff() {
  var finalTarget = currentPlayer ? 0 : 25;

  var highestCandidate = currentPlayer ? 6 : 19;

  // from this triangle we could bear off
  var triangleCandidate;

  if (!isDouble) {
    // die1 already moved
    if (totalValue == dice[0]) {
      triangleCandidate = finalTarget-sign*dice[0];
      if (triangles[triangleCandidate].checkersStack.length > 0) {
        triangles[triangleCandidate].possibleTargets.push(finalTarget);
      } // die0 bear off possible
      else {

        if (highestCandidatesAreEmpty(highestCandidate,
                                            triangleCandidate)) {
          triangles[getFirstLowCandidate(triangleCandidate,finalTarget, sign)].possibleTargets.push(finalTarget);
        } // if the higher triangles are empty
      } // if this triangle is empty
    } // if die1 already moved

    // die0 already moved
    else if (totalValue == dice[1]) {
      triangleCandidate = finalTarget-sign*dice[1];
      if (triangles[triangleCandidate].checkersStack.length > 0) {
        triangles[triangleCandidate].possibleTargets.push(finalTarget);
      } // die1 bare off possible
      else {
        if (highestCandidatesAreEmpty(highestCandidate,
                                            triangleCandidate)) {
          triangles[getFirstLowCandidate(triangleCandidate,finalTarget, sign)].possibleTargets.push(finalTarget);

        } // if the higher triangles are empty
      } // if this triangle is empty
    } // die0 already moved

    else {
      // add possibility from die0
      triangleCandidate = finalTarget-sign*dice[0];
      if (triangles[triangleCandidate].checkersStack.length > 0) {
        triangles[triangleCandidate].possibleTargets.push(finalTarget);
      } // die0 bear off possible
      else {
        if (highestCandidatesAreEmpty(highestCandidate,
                                            triangleCandidate)) {
          triangles[getFirstLowCandidate(triangleCandidate,finalTarget, sign)].possibleTargets.push(finalTarget);
        } // if the higher triangles are empty
      } // if this triangle is empty

      // add possibility from die1
      triangleCandidate = finalTarget-sign*dice[1];
      if (triangles[triangleCandidate].checkersStack.length > 0) {
        triangles[triangleCandidate].possibleTargets.push(finalTarget);
      } // die1 bare off possible
      else {
        if (highestCandidatesAreEmpty(highestCandidate,
                                            triangleCandidate)) {
          triangles[getFirstLowCandidate(triangleCandidate,finalTarget, sign)].possibleTargets.push(finalTarget);
        } // if the higher triangles are empty
      } // if this triangle is empty

      // if possible, add the sum as well
      if (dice[0] + dice[1] <= 6) {
        triangleCandidate = finalTarget-sign*(dice[0]+dice[1]);
        if (triangles[triangleCandidate].checkersStack.length > 0) {
          triangles[triangleCandidate].possibleTargets.push(finalTarget);
        } // sum bear off possible
        else {
          if (highestCandidatesAreEmpty(highestCandidate,
                                              triangleCandidate)) {
            triangles[getFirstLowCandidate(triangleCandidate,finalTarget, sign)].possibleTargets.push(finalTarget);
          } // if the higher triangles are empty
        } // if this triangle is empty
      } // if sum bear off could be possible
    } // neither die already moved
  } // if is not double

  else {
    triangleCandidate = finalTarget-sign*dice[0];
    if (triangles[triangleCandidate].checkersStack.length > 0) {
      triangles[triangleCandidate].possibleTargets.push(finalTarget);
    } // bear off possible
    else {
      if (highestCandidatesAreEmpty(highestCandidate,
                                          triangleCandidate)) {
        triangles[getFirstLowCandidate(triangleCandidate,finalTarget, sign)].possibleTargets.push(finalTarget);
      } // if the higher triangles are empty
    } // if this triangle is empty
  } // if is double
} // bearOff


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
