const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function isAdj(headX, headY, tailX, tailY) {
  return Math.abs(headX - tailX) <= 1 && Math.abs(headY - tailY) <= 1;
}

// give the direction of movement of a knot at [tailX, tailY] towards [headX, headY]
function tug([headX, headY], [tailX, tailY]) {
  if (isAdj(headX, headY, tailX, tailY)) return [0, 0];

  return [Math.sign(headX - tailX), Math.sign(headY - tailY)];
}

function directionToVector(input) {
  if (input.startsWith("R")) return [1, 0];
  if (input.startsWith("L")) return [-1, 0];
  if (input.startsWith("U")) return [0, 1];
  if (input.startsWith("D")) return [0, -1];
}

function moveKnots(inputs, numKnots) {
  let segments = _.range(0, numKnots - 1).map(i => [0, 0]);
  let seen = new Set();

  for (let input of inputs) {
    let [_, direction, numMoves] = input.match(/(.) (\d+)/);
    let [dirX, dirY] = directionToVector(direction);

    for (let move = 0; move < numMoves; move++) {
      segments[0][0] += dirX;
      segments[0][1] += dirY;

      for (let knot = 1; knot < numKnots; knot++) {
        let [deltaX, deltaY] = tug(segments[knot - 1], segments[knot]);
        segments[knot][0] += deltaX;
        segments[knot][1] += deltaY;
      }
      seen.add(`${segments[numKnots - 1][0]},${segments[numKnots - 1][1]}`);
    }
  }

  return seen.size;
}

let partOne = (inputs) => moveKnots(inputs, 2);
let partTwo = (inputs) => moveKnots(inputs, 10);

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };