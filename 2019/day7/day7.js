const fs = require("fs");
const path = require("path");
const { runInstructions } = require("../common/intcode-compiler");

const PHASE_SETTINGS = [0, 1, 2, 3, 4];
const PHASE_SETTINGS_PART_TWO = [5, 6, 7, 8, 9];

function generatePermutations(values, remainingLength) {
  if (remainingLength == 1) {
    return values.map(value => [value]);
  };

  let smallerPermutations = generatePermutations(values, remainingLength - 1);

  let permutations = [];
  for (value of values) {
    for (permutation of smallerPermutations) {
      if (!permutation.includes(value)) {
        permutations.push([value, ...permutation]);
      }
    }
  }

  return permutations;
}

function partOne(instrs) {
  let permutations = generatePermutations(PHASE_SETTINGS, PHASE_SETTINGS.length);

  let [maxPermutation, maxValue] = permutations.reduce(([currMaxPermutation, currMaxValue], permutation) => {
    let carry = 0;

    for (entry of permutation) {
      carry = runInstructions(instrs, [entry, carry])[0];
    }

    if (carry > currMaxValue) return [permutation, carry];

    return [currMaxPermutation, currMaxValue];
  }, [null, 0]);

  return maxValue;
}


function partTwo(instrs) {
  let permutations = generatePermutations(PHASE_SETTINGS_PART_TWO, PHASE_SETTINGS_PART_TWO.length);
  let currentValue = [0];

  let permutation = [9,8,7,6,5];

  return false;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);
  let instrs = input[0].split(',');

  // console.log(`Part one answer: ${partOne(instrs)}`);
  console.log(`Part two answer: ${partTwo(instrs)}`);
}

module.exports = { main };