const fs = require("fs");
const path = require("path");
const { runInstructions } = require("../common/intcode-compiler");

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);
  let instrs = input[0].trim().split(',');

  console.log(`Part one answer: ${runInstructions(instrs, ["1"], false)}`);
  console.log(`Part two answer: ${runInstructions(instrs, ["2"], false)}`);
}

module.exports = { main };