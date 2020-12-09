const fs = require("fs");
const path = require("path");

const PART_TWO_EXPECTED_OUTPUT = 19690720;

function runInstructions(sourceInstrs) {
  let iptr = 0;
  // Create a copy of the instruction set so that this method can modify them
  let instrs = sourceInstrs.slice();

  while (iptr < instrs.length) {
    if (instrs[iptr] == 1) {
      instrs[instrs[iptr + 3]] = instrs[instrs[iptr + 1]] + instrs[instrs[iptr + 2]];
      iptr += 4;
    } else if (instrs[iptr] == 2) {
      instrs[instrs[iptr + 3]] = instrs[instrs[iptr + 1]] * instrs[instrs[iptr + 2]];
      iptr += 4;
    } else if (instrs[iptr] == 99) {
      return instrs;
    } else {
      return "error";
    }
  }
}

// Find a modified version of the given instrs that result in the expected output at address 0
function findModifiedCode(instrs, expectedOutput) {
  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      instrs[1] = noun;
      instrs[2] = verb;

      if (runInstructions(instrs)[0] == expectedOutput) return noun * 100 + verb;
    }
  }
}

function main() {
  let originalInput = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(',').map(Number);
  originalInput[1] = 12;
  originalInput[2] = 2;

  console.log(`Part one answer: ${runInstructions(originalInput)[0]}`);
  console.log(`Part two answer: ${findModifiedCode(originalInput, PART_TWO_EXPECTED_OUTPUT)}`);
}

module.exports = { main };