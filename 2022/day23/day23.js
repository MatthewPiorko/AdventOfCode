const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

const OBJECTS = {
  EMPTY: '.',
  ELF: '#'
};

function isEmpty(map, x, y) {
  return map[`${x},${y}`] !== true;
}

function firstValidMove(map, x, y, moves) {
  for (let i = 0; i < 4; i++) {
    if (isEmpty(map, x + moves[i][0][0], y + moves[i][0][1]) && 
        isEmpty(map, x + moves[i][1][0], y + moves[i][1][1]) && 
        isEmpty(map, x + moves[i][2][0], y + moves[i][2][1])) {
        return moves[i][3];
    }
  }

  return [0, 0];
}

function numEmptyInBoundingBox(points, pointsList) {
  let minX = _.min(pointsList.map(([x,y]) => x));
  let maxX = _.max(pointsList.map(([x,y]) => x));
  let minY = _.min(pointsList.map(([x,y]) => y));
  let maxY = _.max(pointsList.map(([x,y]) => y));

  let numEmpty = 0;
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      if (points[`${x},${y}`] !== true) numEmpty++;
    }
  }

  return numEmpty;
}

function printPoints(points, pointsList) {
  let minX = _.min(pointsList.map(([x,y]) => x));
  let maxX = _.max(pointsList.map(([x,y]) => x));
  let minY = _.min(pointsList.map(([x,y]) => y));
  let maxY = _.max(pointsList.map(([x,y]) => y));

  let xOffset = maxX - minX;
  let map = _.arr2D(maxX - minX + 3, maxY - minY + 3, OBJECTS.EMPTY);
  for (let [x,y] of pointsList) {
    map[y - minY + 1][x - minX + 1] = OBJECTS.ELF;
  }

  _.print2D(map);
}

function haveAnyPointsMoved(pointsList, prevPointsList) {
  for (let i = 0; i < pointsList.length; i++) {
    if (pointsList[i][0] !== prevPointsList[i][0] || pointsList[i][1] !== prevPointsList[i][1]) return true;
  }

  return false;
}

let hasNeighbor = (points, x, y) => _.ADJ.some(([adjX, adjY]) => points[`${x + adjX},${y + adjY}`] === true);

// continuously move elves until either the maxIter is reached, or nobody's moving
function moveElves(inputs, maxIter) {
  let map = inputs.map(row => row.split(''));
  let moves = [
    [[0, -1], [-1, -1], [1, -1], [0, -1]],
    [[0, 1], [-1, 1], [1, 1], [0, 1]],
    [[-1, 0], [-1, -1], [-1, 1], [-1, 0]],
    [[1, 0], [1, -1], [1, 1], [1, 0]]
  ];
  let points = {};
  let pointsList = [];

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === OBJECTS.ELF) {
        points[`${x},${y}`] = true;
        pointsList.push([x, y]);
      }
    }
  }

  for (let i = 1; i <= maxIter; i++) {
    let prevPointsList = pointsList.map(([x,y]) => [x,y]);
    let validMoves = {};
    let proposedMoveList = [];

    // generate proposed moves
    for (let [x,y] of pointsList) {
      if (!hasNeighbor(points, x, y)) {
        proposedMoveList.push([x, y]);
        continue;
      }

      let [deltaX, deltaY] = firstValidMove(points, x, y, moves);
      let key = `${x + deltaX},${y + deltaY}`;

      // only let one elf move to each position
      validMoves[key] = validMoves[key] === undefined;

      proposedMoveList.push([x + deltaX, y + deltaY]);
    }

    // make proposed moves if valid
    for (let m = 0; m < proposedMoveList.length; m++) {
      let [newX, newY] = proposedMoveList[m];
      if (validMoves[`${newX},${newY}`] === false) continue;

      delete points[`${pointsList[m][0]},${pointsList[m][1]}`];
      points[`${newX},${newY}`] = true;
      pointsList[m][0] = newX;
      pointsList[m][1] = newY;
    }

    // move the first move to the end
    moves = [...moves.slice(1, 4), moves[0]];

    if (!haveAnyPointsMoved(pointsList, prevPointsList)) return i;
  }

  return numEmptyInBoundingBox(points, pointsList);
}

let partOne = (inputs, testMode) => moveElves(inputs, 10);
let partTwo = (inputs, testMode) => moveElves(inputs, 5000);

function main(file, testMode) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  let partOneStart = performance.now();
  console.log(`Part one answer: ${partOne(inputs, testMode)} (took ${(performance.now() - partOneStart).toFixed(0)}ms)`);

  let partTwoStart = performance.now()
  console.log(`Part two answer: ${partTwo(inputs, testMode)} (took ${(performance.now() - partTwoStart).toFixed(0)}ms)`);
}

module.exports = { main };