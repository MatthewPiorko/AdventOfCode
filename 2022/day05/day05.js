const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function parseBoxes(inputs) {
  let stackNumbersRow = inputs.find(row => row.startsWith(" 1"));
  let numStacks = Number(stackNumbersRow[stackNumbersRow.length - 2]);

  let stacks = Array.from({ length: numStacks + 1 }, (val, idx) => []);

  for (let row of inputs) {
    if (row.startsWith(" 1")) return stacks;

    for (let i = 0; i < row.length; i += 4) {
      let box = row[i + 1];
      if (box !== ' ') stacks[(i / 4) + 1].push(box);
    }
  }
}

function partOneMove(stacks, row) {
  let [_, count, start, end] = row.match(/move (\d+) from (\d+) to (\d+)/);

  for (let i = 0; i < count; i++) {
    let box = stacks[start][0];
    stacks[start] = stacks[start].slice(1);
    stacks[end] = [box].concat(stacks[end]);
  }
}

function applyMovingFunction(inputs, moveFunction) {
  let stacks = parseBoxes(inputs);
  inputs = inputs.filter(input => input.startsWith("move"));
  inputs.forEach(row => moveFunction(stacks, row));

  return stacks.map(stack => stack[0]).join('');
}

function partOne(inputs) {
  return applyMovingFunction(inputs, partOneMove);
}

function partTwoMove(stacks, row) {
  let [_, count, start, end] = row.match(/move (\d+) from (\d+) to (\d+)/);

  let boxes = stacks[start].slice(0, count);
  stacks[start] = stacks[start].slice(count);
  stacks[end] = boxes.concat(stacks[end]);
}

function partTwo(inputs) {
  return applyMovingFunction(inputs, partTwoMove);
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };