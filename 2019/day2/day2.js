const fs = require("fs");
const path = require("path");

const { runInstructions } = require("../common/intcode-compiler");

const PART_TWO_EXPECTED_OUTPUT = "19690720";

function findFirstInstructionAfter(originalInstrs) {
  let instrs = originalInstrs.slice();

  runInstructions(instrs);

  return instrs[0];
}

// Find a modified version of the given instrs that result in the expected output at address 0
function findModifiedCode(originalInstrs, expectedOutput) {
  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      let instrs = originalInstrs.slice();

      instrs[1] = noun.toString();
      instrs[2] = verb.toString();

      runInstructions(instrs);

      if (instrs[0] == expectedOutput) return noun * 100 + verb;
    }
  }
}

function main() {
  let originalInput = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(',');
  originalInput[1] = "12";
  originalInput[2] = "2";

  console.log(`Part one answer: ${findFirstInstructionAfter(originalInput)}`);
  console.log(`Part two answer: ${findModifiedCode(originalInput, PART_TWO_EXPECTED_OUTPUT)}`);
}

module.exports = { main };