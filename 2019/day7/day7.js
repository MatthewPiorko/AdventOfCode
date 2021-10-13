const fs = require("fs");
const path = require("path");

const { runInstructionsOnList, runInstructionsAsync } = require("../common/intcode-compiler");

const PHASE_SETTINGS = [0, 1, 2, 3, 4];
const PHASE_SETTINGS_PART_TWO = [5, 6, 7, 8, 9];

function generatePermutations(values, remainingLength) {
  if (remainingLength == 1) {
    return values.map(value => [value]);
  };

  let smallerPermutations = generatePermutations(values, remainingLength - 1);

  let permutations = [];
  for (let value of values) {
    for (let permutation of smallerPermutations) {
      if (!permutation.includes(value)) {
        permutations.push([value, ...permutation]);
      }
    }
  }

  return permutations;
}

function partOne(instrs) {
  let permutations = generatePermutations(PHASE_SETTINGS, PHASE_SETTINGS.length);

  return permutations.map(permutation => {
    let carry = 0;

    for (let entry of permutation) {
      [carry] = runInstructionsOnList(instrs.slice(), [entry, carry]);
    }

    return [permutation, carry];
  }).reduce(([maxPerm, maxVal], [perm, val]) => {
    if (val > maxVal) return [perm, val];
    else return [maxPerm, maxVal];
  }, [undefined, 0])[1];
}

async function wait(n) { 
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, n);
  });
}

async function makeThruster(instrs, index, inputStreams) {
  let makeOutputFunc = (n) => {
    return (int) => {
      inputStreams[(n + 1) % 5].push(int);
    }
  }

  let makeInputFunc = (n) => {
    return async () => {
      let stream = inputStreams[n];

      while (stream.length == 0) {
        await wait(1);
      }
      return stream.shift();
    }
  }

  await runInstructionsAsync(instrs.slice(), makeInputFunc(index), makeOutputFunc(index));
}

async function findBestAmplificationWithFeedback(instrs) {
  let permutations = generatePermutations(PHASE_SETTINGS_PART_TWO, PHASE_SETTINGS_PART_TWO.length);

  let maxValue = 0;

  for (permutation of permutations) {
    let res = await amplifyWithFeedback(instrs, permutation);

    if (res > maxValue) maxValue = res;

    console.log(`${permutation} => ${res}`);
  }

  console.log(`Part two answer: ${maxValue}`);
}

async function amplifyWithFeedback(instrs, permutation) {
  let inputStreams = permutation.map(i => [i]);
  inputStreams[0].push(0);

  makeThruster(instrs, 0, inputStreams);
  makeThruster(instrs, 1, inputStreams);
  makeThruster(instrs, 2, inputStreams);
  makeThruster(instrs, 3, inputStreams);
  await makeThruster(instrs, 4, inputStreams);

  return inputStreams[0][0];
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);
  let instrs = input[0].split(',');

  console.log(`Part one answer: ${partOne(instrs)}`);
  findBestAmplificationWithFeedback(instrs);
}

module.exports = { main };