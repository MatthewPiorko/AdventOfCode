const fs = require("fs");
const path = require("path");

function partOne(inputs) {
  return undefined;
}

function partTwo(inputs) {
  return undefined;
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };