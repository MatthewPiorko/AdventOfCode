const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function partOne(inputs, testMode) {
  return _.sum(inputs.map(checkIfValid));
}

function checkIfValid(game) {
  let [_, gameId, draws] = game.match(/Game (\d+): (.*)/);
  let maxShown = calculateMaxPerColor(draws);

  if (maxShown["red"] <= 12 && maxShown["green"] <= 13 && maxShown["blue"] <= 14) return Number(gameId);
  else return 0;
}

function calculateMaxPerColor(draws) {
  let maxShown = { "red": 0, "green": 0, "blue": 0 };

  for (let draw of draws.split(";")) {
    for (let count of draw.split(",")) {
      let [_, num, color] = count.match(/(\d+) (\w+)/);
      maxShown[color] = Math.max(Number(num), maxShown[color]);
    }
  }

  return maxShown;
}

function partTwo(inputs, testMode) {
  return _.sum(inputs.map(calculateMinimum));
}

function calculateMinimum(game) {
  let [_, gameId, draws] = game.match(/Game (\d+): (.*)/);
  let maxShown = calculateMaxPerColor(draws);

  return maxShown["red"] * maxShown["green"] * maxShown["blue"];
}

function main(file, testMode) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  let partOneStart = performance.now();
  console.log(`Part one answer: ${partOne(inputs, testMode)} (took ${(performance.now() - partOneStart).toFixed(0)}ms)`);

  let partTwoStart = performance.now()
  console.log(`Part two answer: ${partTwo(inputs, testMode)} (took ${(performance.now() - partTwoStart).toFixed(0)}ms)`);
}

module.exports = { main };