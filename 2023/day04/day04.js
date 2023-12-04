const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function partOne(inputs, testMode) {
  return _.sum(inputs.map(game => {
    let numMatches = countMatches(game);
    return numMatches > 0 ? 2**(numMatches - 1) : 0;
  }));
}

function countMatches(game) {
  let [_, winners, givens] = game.match(/Card.*:\s+(.*) \|\s+(.*)/);

  let matches = 0;
  let winning = new Set(winners.split(/\s+/));
  for (let given of givens.split(/\s+/)) {
    if (winning.has(given)) matches++;
  }
  
  return matches;
}

function partTwo(inputs, testMode) {
  let numCopies = _.range(0, inputs.length - 1, step=0, initial=1);

  for (let i = 0; i < inputs.length; i++) {
    let numMatches = countMatches(inputs[i]);
    
    for (let j = 1; j <= numMatches; j++) {
      if (i + j > inputs.length) break;
      numCopies[i + j] = numCopies[i + j] + numCopies[i];
    }
  }

  return _.sum(numCopies);
}

function main(file, testMode) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  let partOneStart = performance.now();
  console.log(`Part one answer: ${partOne(inputs, testMode)} (took ${(performance.now() - partOneStart).toFixed(0)}ms)`);

  let partTwoStart = performance.now()
  console.log(`Part two answer: ${partTwo(inputs, testMode)} (took ${(performance.now() - partTwoStart).toFixed(0)}ms)`);
}

module.exports = { main };