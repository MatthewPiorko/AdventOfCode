const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function partOne(inputs) {
  let x = 1;
  let cycle = 0;
  let value = 0;

  let runCycle = () => {
    cycle++;
    if ((cycle + 20) % 40 === 0) {
        value += cycle * x;
    }
  };

  for (let input of inputs) {
    runCycle();

    if (input.startsWith("addx")) {
      let [_, deltaX] = input.match(/addx (.*)/);
      deltaX = Number(deltaX);

      runCycle();
      x += deltaX;
    }
  }

  return value;
}

function partTwo(inputs) {
  let x = 1;
  let cycle = 0;
  let pixels = [];
  let row = [];

  let printPixel = () => {
    row.push(Math.abs((cycle % 40) - x) <= 1 ? '# ' : '. ');
    cycle++;

    if (cycle % 40 === 0) {
      pixels.push(row); 
      row = [];
    }
  }

  for (let input of inputs) {
    printPixel();

    if (input.startsWith("addx")) {
      let [_, deltaX] = input.match(/addx (.*)/);
      deltaX = Number(deltaX);

      printPixel();
      x += deltaX;
    }
  }

  console.log(`Part two answer:`);
  _.print2D(pixels);
  
  return undefined;
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  partTwo(inputs);
}

module.exports = { main };