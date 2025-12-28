const _ = require('../../util/utils.js');

function partOne(inputs, testMode) {
  let points = parsePoints(inputs);

  let maxSize = 0;
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 1; j < points.length; j++) {
      maxSize = Math.max(maxSize, rectangleSize(points[i], points[j]));
    }
  }

  return maxSize;
}

function parsePoints(inputs) {
  return inputs.map(input => {
    let [match, x, y] = input.match(/(\d+),(\d+)/);
    return [Number(x), Number(y)];
  });
}

function rectangleSize([x1, y1], [x2, y2]) {
  // rectangle size is inclusive of endpoints
  return (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1);
}

function partTwo(inputs, testMode) {
  let points = parsePoints(inputs);

  let lines = [];
  for (let i = 0; i < points.length - 1; i++) {
    lines.push([points[i], points[i + 1]]);
  }

  let maxSize = 0;
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 1; j < points.length; j++) {
      let point1 = points[i], point2 = points[j];

      let potentialSize = rectangleSize(point1, point2);
      if (potentialSize <= maxSize) continue;

      if (isFullyInside(point1, point2, lines)) maxSize = potentialSize;
    }
  }

  return maxSize;
}

function isFullyInside([x1, y1], [x2, y2], lines) {
  let minX = Math.min(x1, x2), maxX = Math.max(x1, x2);
  let minY = Math.min(y1, y2), maxY = Math.max(y1, y2);

  // if the box is one or two lines thick, the entirety of it is already made of carpet
  if (maxY - minY <= 1 || maxX - minX <= 1) return true;

  // otherwise, the inside area must:
  // a. have no interior line intersections
  // b. when approached from outside, intersect an odd number of lines
  let insideMinX = minX + 1, insideMinY = minY + 1;
  let insideMaxX = maxX - 1, insideMaxY = maxY - 1;
  
  if (hasInteriorIntersections(insideMinX, insideMinY, insideMaxX, insideMaxY, lines)) return false;

  let horizontalIntersections = numHorizontalIntersections(insideMinX, insideMinY, lines);
  if (horizontalIntersections % 2 === 0) return false;

  let verticalIntersections = numVerticalIntersections(insideMinX, insideMinY, lines);
  if (verticalIntersections % 2 === 0) return false;

  return true;
}

function hasInteriorIntersections(insideMinX, insideMinY, insideMaxX, insideMaxY, lines) {
  for (let [[x1, y1], [x2, y2]] of lines) {
    // if the line starts or ends inside, it intersects
    if (x1 >= insideMinX && x1 <= insideMaxX && y1 >= insideMinY && y1 <= insideMaxY) return true;
    if (x2 >= insideMinX && x2 <= insideMaxX && y2 >= insideMinY && y2 <= insideMaxY) return true;

    let minX = Math.min(x1, x2), maxX = Math.max(x1, x2);
    let minY = Math.min(y1, y2), maxY = Math.max(y1, y2);

    // if the line is vertical, and starts above and ends below, it intersects
    if (x1 === x2 && x1 >= insideMinX && x1 <= insideMaxX && minY <= insideMinY && maxY >= insideMaxY) return true;

    // if the line is horizontal, and starts left and ends right, it intersects
    if (y1 === y2 && y1 >= insideMinY && y1 <= insideMaxY && minX <= insideMinX && maxX >= insideMaxX) return true;
  }

  return false;
}

function numHorizontalIntersections(x, y, lines) {
  numIntersections = 0;
  for (let [[x1, y1], [x2, y2]] of lines) {
    if (y > Math.min(y1, y2) && y < Math.max(y1, y2) && x > Math.min(x1, x2)) numIntersections++;
  }

  return numIntersections;
}

function numVerticalIntersections(x, y, lines) {
  numIntersections = 0;
  for (let [[x1, y1], [x2, y2]] of lines) {
    if (x > Math.min(x1, x2) && x < Math.max(x1, x2) && y > Math.min(y1, y2)) numIntersections++;
  }

  return numIntersections;
}

module.exports = { partOne, partTwo };