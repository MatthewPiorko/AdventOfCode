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

const GAME_ASCII = {
  0: " ",
  1: "|",
  2: ".",
  3: "~",
  4: "o"
};

const GAME_HEIGHT = 20;
const GAME_WIDTH = 37;

function printTiles(tiles) {
  let str = "";

  for (let y = 0; y <= GAME_HEIGHT; y++) {
    for (let x = 0; x <= GAME_WIDTH; x++) {
      str += GAME_ASCII[tiles[[x,y]] || 0];
    }

    str += "\n";
  }

  console.log(str);
}

function partTwo(instrs) {
  instrs[0] = "2";

  let paddleX, ballX;
  let tiles = {};
  let outputStream = [];

  let input = () => {
    // printTiles(tiles);

    if (ballX > paddleX) return 1;
    if (ballX == paddleX) return 0;
    if (ballX < paddleX) return -1;

  }

  let output = (int) => {
    outputStream.push(int);

    if (outputStream.length == 3) {
      let [x, y, tileId] = outputStream;

      if (tileId == 4) ballX = x;
      if (tileId == 3) paddleX = x;

      tiles[[x,y]] = tileId;
      outputStream = [];
    }
  }

  runInstructions(instrs, input, output);

  return tiles[[-1, 0]];
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/)
  let instrs = input[0].trim().split(',');

  console.log(`Part one answer: ${partOne(instrs)}`);
  console.log(`Part two answer: ${partTwo(instrs)}`);
}

module.exports = { main };