const fs = require("fs");
const path = require("path");

function stringifyPosition(x, y) {
  return `${x},${y}`;
}

function destringifyPosition(position) {
  let positionRegex = position.match(/(-?\d+),(-?\d+)/);

  return [Number(positionRegex[1]), Number(positionRegex[2])];
}

// Find all visited positions from a given path
// Returns [visited positions, map of position => steps taken]
function generateVisitedSet(path) {
  let moveList = path.split(',');
  let currentX = 0, currentY = 0;
  let visited = new Set();
  let stepCounts = {};
  let totalSteps = 1;

  for (move of moveList) {
    let moveRegex = move.match(/(\w)(\d+)/);

    let direction = moveRegex[1];
    let length = moveRegex[2];

    for (let step = 0; step < length; step++) {
      switch (direction) {
        case "L":
          currentX--;
          break;
        case "R":
          currentX++;
          break;
        case "U":
          currentY++;
          break;
        case "D":
          currentY--;
          break;
      }

      let str = stringifyPosition(currentX, currentY);
      visited.add(str);
      stepCounts[str] = totalSteps;
      totalSteps++;
    }
  }

  return [visited, stepCounts];
}

// Find a list of intersections on a path with a given visited path
// Returns a list of [intersection point, total steps between paths]
function findIntersectionPoints(visited, path, stepCountMap) {
  let moveList = path.split(',');
  let currentX = 0, currentY = 0;
  let intersections = [];
  let totalSteps = 1;

  for (move of moveList) {
    let moveRegex = move.match(/(\w)(\d+)/);

    let direction = moveRegex[1];
    let length = moveRegex[2];

    for (let step = 0; step < length; step++) {
      switch (direction) {
        case "L":
          currentX--;
          break;
        case "R":
          currentX++;
          break;
        case "U":
          currentY++;
          break;
        case "D":
          currentY--;
          break;
      }

      let str = stringifyPosition(currentX, currentY);
      if (visited.has(str)) {
        intersections.push([str, stepCountMap[str] + totalSteps]);
      }
      totalSteps++;
    }
  }

  return intersections;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split('\n');
  let [firstPath, secondPath] = input;

  let [firstPathPositions, stepCountMap] = generateVisitedSet(firstPath);
  let intersections = findIntersectionPoints(firstPathPositions, secondPath, stepCountMap);
  
  let closestDistance = intersections.reduce((minDistance, intersection) => {
    let [intersectionX, intersectionY] = destringifyPosition(intersection[0]);
    let distance = Math.abs(intersectionX) + Math.abs(intersectionY);

    return Math.min(distance, minDistance);
  }, Infinity);

  console.log(`Part one answer: ${closestDistance}`);
  
  let minSteps = intersections.reduce((acc, val) => Math.min(acc, val[1]), Infinity);
  console.log(`Part two answer: ${minSteps}`);
}

module.exports = { main };