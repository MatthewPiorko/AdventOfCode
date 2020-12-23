const fs = require("fs");
const path = require("path");
const { runInstructionsOnList } = require("../common/intcode-compiler");

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split('\n');
  let instrs = input[0].trim().split(',');

  console.log(`Part one answer: ${runInstructionsOnList(instrs.slice(), ["1"])}`);
  console.log(`Part two answer: ${runInstructionsOnList(instrs.slice(), ["5"])}`);
}

module.exports = { main };