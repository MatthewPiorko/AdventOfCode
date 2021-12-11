const fs = require("fs");
const path = require("path");

const COMMANDS = {
  FORWARD: 'forward',
  DOWN: 'down',
  UP: 'up'
}

function partOne(inputs) {
  let x = 0, y = 0;
  for (let input of inputs) {
    let [, command, value] = input.match(/(\w+) (\d+)/);
    value = Number(value);

    if (command === COMMANDS.FORWARD) x += value;
    else if (command === COMMANDS.DOWN) y += value;
    else if (command === COMMANDS.UP) y -= value;
  }

  return x * y;
}

function partTwo(input) {
  let x = 0, y = 0, aim = 0;
  for (let i = 0; i < input.length; i++) {
    let [, command, value] = input[i].match(/(\w+) (\d+)/);
    value = Number(value);

    if (command === COMMANDS.FORWARD) { x += value; y += (aim * value); }
    else if (command === COMMANDS.DOWN) aim += value;
    else if (command === COMMANDS.UP) aim -= value;
  }

  return x * y;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(input)}`);
  console.log(`Part two answer: ${partTwo(input)}`);
}

module.exports = { main };