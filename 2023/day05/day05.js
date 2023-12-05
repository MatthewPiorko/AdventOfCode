const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

class Transform {
  constructor(str) {
    let [_, target, source, range] = str.match(/(\d+) (\d+) (\d+)/);
    this.source = Number(source);
    this.target = Number(target);
    this.range = Number(range);
  }

  toString() {
    return `${this.target} ${this.source} ${this.range}`;
  }
}

function parseTransforms(inputs) {
  let transforms = [];
  let currentTransforms = [];

  for (let input of inputs.slice(2)) {
    if (input.length === 0) {
      transforms.push(currentTransforms);
      currentTransforms = [];
    } else if (/\d+/.test(input)) {
      currentTransforms.push(new Transform(input));
    }
  }
  transforms.push(currentTransforms);

  return transforms;
}

function partOne(inputs, testMode) {
  let seeds = inputs[0].split(" ").slice(1).map(Number);
  let transforms = parseTransforms(inputs);

  return _.min(seeds.map(seed => {
    return runTransforms(seed, transforms);
  }));
}

function runTransforms(seed, transforms) {
  for (let transform of transforms) {
    seed = getMappedValue(seed, transform);
  }

  return seed;
}

function getMappedValue(seed, transforms) {
  for (let transform of transforms) {
    if (transform.source <= seed && seed <= transform.source + transform.range) {
      return transform.target + (seed - transform.source);
    }
  }

  return seed;
}

// checking all the possible seeds took too long
// so instead, check every number in increasing order, to find the first one that's in the seeds,
// after running the number through the transforms in reverse
function partTwo(inputs, testMode) {
  let seeds = inputs[0].split(" ").slice(1).map(Number);
  let transforms = parseTransforms(inputs).reverse();

  // max seemed to be ~10 billion, this just prevents infinite spinning
  for (let i = 0; i < 10000000000; i++) {
    let inverse = runInverseTransforms(i, transforms)
    if (hasSeed(inverse, seeds)) return i;
  }
}

function runInverseTransforms(seed, transforms) {
  for (let transform of transforms) {
    seed = getInverseMappedValue(seed, transform);
  }

  return seed;
}

// 1am brain cannot prove this logic, but empirically it works
function getInverseMappedValue(seed, transforms) {
  for (let transform of transforms) {
    if (transform.target <= seed && seed <= transform.target + transform.range) {
      return transform.source + (seed - transform.target);
    }
  }

  return seed;
}

function hasSeed(n, seeds) {
  for (let i = 0; i < seeds.length; i+=2) {
    if (seeds[i] <= n && n < seeds[i] + seeds[i + 1]) return true;
  }

  return false;
}

function main(file, testMode) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  let partOneStart = performance.now();
  console.log(`Part one answer: ${partOne(inputs, testMode)} (took ${(performance.now() - partOneStart).toFixed(0)}ms)`);

  let partTwoStart = performance.now()
  console.log(`Part two answer: ${partTwo(inputs, testMode)} (took ${(performance.now() - partTwoStart).toFixed(0)}ms)`);
}

module.exports = { main };