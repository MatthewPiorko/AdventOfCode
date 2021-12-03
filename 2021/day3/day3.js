const fs = require("fs");
const path = require("path");

function mostCommonBit(inputs, pos) {
  // 1 is most common if at least half of bits at pos are 1
  return inputs.filter(input => input[pos] === 1).length >= (inputs.length / 2) ? 1 : 0;
}

function leastCommonBit(inputs, pos) {
  return 1 - mostCommonBit(inputs, pos);
}

function createBitString(inputs, bitSelector) {
  return Array(inputs[0].length).fill(0).map((_, pos) => bitSelector(inputs, pos)).join("");
}

function partOne(inputs) {
  let epsilon = Number.parseInt(createBitString(inputs, mostCommonBit), 2);
  let gamma = Number.parseInt(createBitString(inputs, leastCommonBit), 2);
  
  return epsilon * gamma;
}

function filterUntilSingle(inputs, bitSelector) {
  let pos = 0;
  while (inputs.length > 1) {
    let selectedBit = bitSelector(inputs, pos);
    inputs = inputs.filter(input => input[pos] === selectedBit);
    pos++;
  }

  return inputs[0].join("");
}

function partTwo(input) {
  let oxygen = Number.parseInt(filterUntilSingle(input, mostCommonBit), 2);
  let co2 = Number.parseInt(filterUntilSingle(input, leastCommonBit), 2);
  
  return oxygen * co2;
}

function main(file) {
  let input = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/).map(row => row.split("").map(Number));

  console.log(`Part one answer: ${partOne(input)}`);
  console.log(`Part two answer: ${partTwo(input)}`);
}

module.exports = { main };