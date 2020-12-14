const fs = require("fs");
const path = require("path");
const { runInstructions } = require("../common/intcode-compiler");

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split('\n');
  let instrs = input[0].trim().split(',');

  console.log(`Part one answer: ${runInstructions(instrs, ["1"])}`);
  console.log(`Part two answer: ${runInstructions(instrs, ["5"])}`);
}

module.exports = { main };