const fs = require("fs");
const path = require("path");

const DOOR_NUMBER = 7;
const MODULUS = 20201227;

function partOne(input) {
  let i = 0;
  let value = DOOR_NUMBER;

  while (true) {
    value = (value * DOOR_NUMBER) % MODULUS;
    i++;

    if (value == input[0]) break;
  }

  CARD_NUMBER = input[1];
  value = CARD_NUMBER;
  for (let count = 0; count < i; count++) {
    value = (value * CARD_NUMBER) % MODULUS;
  }

  return value;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(input)}`);
}

module.exports = { main };