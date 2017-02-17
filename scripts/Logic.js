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

function highestCandidatesAreEmpty(lastTriangle, tri) {
  var increment = currentPlayer? 1 : -1;
  var currentTriangle = tri + increment;
  while (currentTriangle != lastTriangle + increment) {
    if (triangles[currentTriangle].checkersStack.length > 0) {
      return false;
    }
    currentTriangle += increment;
  }
  return true;
}

function getFirstLowCandidate(tri, target, sign) {
  tri += sign;
  while (tri != target) {
    if (triangles[tri].checkersStack.length > 0) {
      if (triangles[tri].checkersStack[triangles[tri].checkersStack.length-1] > (currentPlayer ? 14 : 0)) {
        return tri;
      }
    } // first non-empty bearing triangle encountered
    tri += sign;
  } // look for the first non-empty
}
