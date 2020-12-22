const fs = require("fs");
const path = require("path");
const { runInstructions } = require("../common/intcode-compiler");

const COLOR = {
  BLACK: 0,
  WHITE: 1
};

const DIRECTION = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3
};

const COLOR_ASCII = {
  0: ".",
  1: "#"
}

function printMap(map, pos, dir) {
  let mapString = "";

  let values = Object.keys(map).map(key => {
    let [_, y, x] = key.match(/(.*),(.*)/);

    return [Number(y), Number(x)];
  });

  let minX = values.reduce((acc, val) => Math.min(acc, val[1]), +Infinity);
  let maxX = values.reduce((acc, val) => Math.max(acc, val[1]), -Infinity);
  let minY = values.reduce((acc, val) => Math.min(acc, val[0]), +Infinity);
  let maxY = values.reduce((acc, val) => Math.max(acc, val[0]), -Infinity);

  for (let y = maxY + 1; y >= minY - 1; y--) {
    for (let x = maxX + 1; x >= minX - 1; x--) {
      mapString += COLOR_ASCII[(map[[y,x]] || 0)];
    }
    mapString += "\n";
  }

  console.log(mapString);
}

function runRobot(instrs, startingTile, shouldPrintMap = false) {
  let pos = [0,0], direction = DIRECTION.UP;
  let panelMap = {};
  panelMap[pos] = startingTile;

  let outputStream = [];

  let getInput = () => {
    return panelMap[pos] || 0;
  }

  let output = (int) => {
    outputStream.push(int);

    if (outputStream.length == 2) {
      let [newColor, turn] = outputStream;
      outputStream = [];

      panelMap[pos] = newColor;

      if (turn == 1) direction = (direction + 1) % 4;
      else direction = (direction + 3) % 4;

      if (direction == DIRECTION.UP) pos[1]++;
      else if (direction == DIRECTION.RIGHT) pos[0]++;
      else if (direction == DIRECTION.DOWN) pos[1]--;
      else if (direction == DIRECTION.LEFT) pos[0]--;
    }

    return;
  }

  runInstructions(instrs, getInput, output);

  if (shouldPrintMap) printMap(panelMap, pos, direction);

  return Object.keys(panelMap).length;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);
  let instrs = input[0].trim().split(',');

  console.log(`Part one answer: ${runRobot(instrs, COLOR.BLACK)}`);
  runRobot(instrs, COLOR.WHITE, true);
}

module.exports = { main };