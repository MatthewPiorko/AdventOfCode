const fs = require("fs");
const path = require("path");

const { runInstructions } = require("../common/intcode-compiler");

function partOne(instrs) {
  let tiles = [];

  let outputStream = [];

  let output = (int) => {
    outputStream.push(int);

    if (outputStream.length == 3) tiles.push(outputStream.splice(0, 3));
  }

  runInstructions(instrs, undefined, output);

  return tiles.filter(tile => tile[2] == 2).length;
}

function partTwo(input) {
  return false;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/)
  let instrs = input[0].trim().split(',');

  console.log(`Part one answer: ${partOne(instrs)}`);
  // console.log(`Part two answer: ${partTwo(input)}`);
}

module.exports = { main };