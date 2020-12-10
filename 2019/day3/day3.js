const fs = require("fs");
const path = require("path");

function stringifyPosition(x, y) {
  return `${x},${y}`;
}

function destringifyPosition(position) {
  let positionRegex = position.match(/(-?\d+),(-?\d+)/);

  return [Number(positionRegex[1]), Number(positionRegex[2])];
}

function generateVisitedSet(moves) {
  let moveList = moves.split(',');
  let currentX = 0, currentY = 0;
  let visited = new Set();
  visited.add(stringifyPosition(0, 0));

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

      visited.add(stringifyPosition(currentX, currentY));
    }
  }

  return visited;
}

function findIntersectionPoints(visited, moves) {
  let moveList = moves.split(',');
  let currentX = 0, currentY = 0;
  let intersections = new Set();

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

      if (visited.has(stringifyPosition(currentX, currentY))) {
        intersections.add(stringifyPosition(currentX, currentY));
      }
    }
  }

  return intersections;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split('\n');

  let firstPathPositions = generateVisitedSet(input[0]);
  let intersections = findIntersectionPoints(firstPathPositions, input[1]);
  let closestDistance = [...intersections].reduce((minDistance, intersection) => {
    let intersectionCoords = destringifyPosition(intersection);
    let distance = Math.abs(intersectionCoords[0]) + Math.abs(intersectionCoords[1]);

    return Math.min(distance, minDistance);
  }, Infinity)
  console.log(`Part one answer: ${closestDistance}`);
  // console.log(`Part two answer: ${partTwo(input)}`);
}

module.exports = { main };