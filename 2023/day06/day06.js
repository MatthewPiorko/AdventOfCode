const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function partOne(inputs, testMode) {
  let times = inputs[0].split(/\s+/).slice(1).map(Number);
  let records = inputs[1].split(/\s+/).slice(1).map(Number);

  let product = 1;
  for (let i = 0; i < times.length; i++) {
    let time = times[i];
    let record = records[i];
    let numWinners = 0;

    for (let t = 0; t < time; t++) {
      if (((time - t) * t) > record) numWinners++;
    }
    product *= numWinners;
  }

  return product;
}

function partTwo(inputs, testMode) {
  let time = Number(inputs[0].split(/\s+/).slice(1).join(""));
  let record = Number(inputs[1].split(/\s+/).slice(1).join(""));

  let numWinners = 0;
  for (let t = 0; t < time; t++) {
    if (((time - t) * t) > record) numWinners++;
  }

  return numWinners;
}

function main(file, testMode) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  let partOneStart = performance.now();
  console.log(`Part one answer: ${partOne(inputs, testMode)} (took ${(performance.now() - partOneStart).toFixed(0)}ms)`);

  let partTwoStart = performance.now()
  console.log(`Part two answer: ${partTwo(inputs, testMode)} (took ${(performance.now() - partTwoStart).toFixed(0)}ms)`);
}

module.exports = { main };