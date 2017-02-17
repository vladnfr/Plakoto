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
