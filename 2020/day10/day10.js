const fs = require("fs");
const path = require("path");

function createJoltSet(input) {
  return input.reduce((set, val) => { set.add(val); return set; }, new Set());
}

function findJoltJumps(joltSet) {
  let currentRating = 0;
  let joltDifferences = [0, 0, 0];

  while (true) {
    if (joltSet.has(currentRating + 1)) {
      currentRating += 1;
      joltDifferences[0]++;
      continue;
    } else if (joltSet.has(currentRating + 2)) {
      currentRating += 2;
      joltDifferences[1]++;
      continue;
    } else if (joltSet.has(currentRating + 3)) {
      currentRating += 3;
      joltDifferences[2]++;
      continue;
    }

    joltDifferences[2]++;
    return joltDifferences;
  }
  return joltSet;
}

function calculateNumberOfArrangements(joltSet, jolt, max, cache) {
  if (cache[jolt] != undefined) return cache[jolt];

  if (jolt == max) return 1;

  let numChoices = 0;

  if (joltSet.has(jolt + 1)) numChoices += calculateNumberOfArrangements(joltSet, jolt + 1, max, cache);
  if (joltSet.has(jolt + 2)) numChoices += calculateNumberOfArrangements(joltSet, jolt + 2, max, cache);
  if (joltSet.has(jolt + 3)) numChoices += calculateNumberOfArrangements(joltSet, jolt + 3, max, cache);

  cache[jolt] = numChoices;

  return numChoices;
}

function calculateTotalArrangements(joltSet) {
  let max = Array.from(joltSet).reduce((acc, val) => Math.max(acc, val), 0) + 3;
  joltSet.add(max);

  let possibilities = calculateNumberOfArrangements(joltSet, 0, max, {});

  return possibilities;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split('\n').map(Number);
  let joltSet = createJoltSet(input);

  let joltJumps = findJoltJumps(joltSet);
  console.log(`Part one answer: ${joltJumps[0] * joltJumps[2]}`);
  console.log(`Part two answer: ${calculateTotalArrangements(joltSet)}`);
}

module.exports = { main };