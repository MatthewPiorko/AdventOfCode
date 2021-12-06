const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

class Line {
  constructor(x1, y1, x2, y2) {
    this.x1 = Number(x1);
    this.y1 = Number(y1);
    this.x2 = Number(x2);
    this.y2 = Number(y2);
  }
}

function compare(num1, num2) {
  if (num1 === num2) return 0;
  return num1 > num2 ? -1 : 1;
}

function parseLines(inputs) {
  return inputs.map(input => {
    let [_, x1, y1, x2, y2] = input.match(/(\d+),(\d+) -> (\d+),(\d+)/);
    return new Line(x1, y1, x2, y2);
  });
}

function incrementVents(board, line) {
  let dist = Math.max(Math.abs(line.x2 - line.x1), Math.abs(line.y2 - line.y1)) + 1;
  let deltaX = compare(line.x1, line.x2), deltaY = compare(line.y1, line.y2);

  _.range(0, dist).forEach(i => {
    let x = line.x1 + (deltaX * i);
    let y = line.y1 + (deltaY * i);

    board[y][x] = board[y][x] + 1;
  });
}

function sumBoard(board) {
  return _.sum2D(_.map2D(board, val => val > 1 ? 1 : 0));
}

function determineVentOverlap(inputs, checkAllowedLine) {
  let lines = parseLines(inputs);
  let maxX = _.max(lines.map(line => Math.max(line.x1, line.x2)));
  let maxY = _.max(lines.map(line => Math.max(line.y1, line.y2)));
  let board = _.arr2D(maxX + 1, maxY + 1, 0);

  lines.forEach(line => {
    if (checkAllowedLine(line)) incrementVents(board, line);
  });

  return sumBoard(board);
}

function partOne(inputs) {
  return determineVentOverlap(inputs, line => line.x1 === line.x2 || line.y1 === line.y2); // Only use orthogonal vents
}

function partTwo(inputs) {
  return determineVentOverlap(inputs, line => true); // Use all vents, including diagonal
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };