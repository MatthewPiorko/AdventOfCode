const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

class Point {
  constructor(x, y, velX, velY) {
    this.x = Number(x);
    this.y = Number(y);
    this.velX = Number(velX);
    this.velY = Number(velY);
  }

  advance() {
    this.x += this.velX;
    this.y += this.velY;
  }
}

// Remove all empty space between 0 and minX, and 0 and minY
function standardizePositive(points) {
  let minX = _.min(points.map(point => point.x));
  let minY = _.min(points.map(point => point.y));
  let adjustX = -1 * minX;
  let adjustY = -1 * minY;
  points.forEach(point => { point.x += adjustX; point.y += adjustY});
}

function makeStarMap(points) {
  standardizePositive(points);
  let maxX = _.max(points.map(point => point.x)) + 1;
  let maxY = _.max(points.map(point => point.y)) + 1;
  let map = _.arr2D(maxX, maxY, '.');
  points.forEach(point => map[point.y][point.x] = '#');

  return map;
}

function countAdj(points, point) {
  const ADJ = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];
  return _.sum(ADJ.map(direction => Number(points.some(point2 => point2.x === point.x + direction[0] && point2.y === point.y + direction[1]))));
}

function checkForAnyAdjacent(points, minimumAdj = 3, minimumTotal = 100) {
  // If minimumTotal points have minimumAdj neighbors, there's probably a message (or about to be)
  // Parameter found through trial and error
  return _.sum(points.map(point => countAdj(points, point) >= minimumAdj ? 1 : 0)) > minimumTotal;
}

function parsePoints(inputs) {
  return inputs.map(input => {
    let [group, x, y, velX, velY] = input.match(/position=<\s*(\-?\d+),\s*(\-?\d+)> velocity=<\s*(\-?\d+),\s*(\-?\d+)>/);
    return new Point(x, y, velX, velY);
  });
}

const MAX_ITER = 100000;

function findMessage(inputs) {
  let points = parsePoints(inputs);

  for (let i = 0; i < MAX_ITER; i++) {
    if (checkForAnyAdjacent(points)) { 
      // Print the next 3 timestamps, to ensure message is displayed
      console.log(`First displayed map found at time ${i}`);
      _.print2D(makeStarMap(points));
      
      points.forEach(point => point.advance());
      _.print2D(makeStarMap(points)); 

      points.forEach(point => point.advance());
      _.print2D(makeStarMap(points)); 
      return; 
    }

    points.forEach(point => point.advance());
  }

  return undefined;
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  findMessage(inputs);
}

module.exports = { main };