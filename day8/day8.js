var fs = require("fs");

// Parse the input into a list of [instruction type, instruction value]
function parseInstructionList(input) {
  return input.map(line => {
    let matches = line.match(/(\w+) (.\d+)/);

    let instr = matches[1];
    let num = Number(matches[2]);

    return [instr, Number(num)];
  });
}

// Run a set of instructions. If a loop is detected, exit immediately.
// Returns [didTerminate, accumulatorAtTermination]
function runInstructions(instrs) {
  let iptr = 0;
  let visited = new Set();
  let acc = 0;

  while (true) {
    if (visited.has(iptr)) return [false, acc];
    visited.add(iptr);

    let instr = instrs[iptr];

    switch (instr[0]) {
      case "nop":
        iptr++;
        break;
      case "acc":
        acc += instr[1];
        iptr++;
        break;
      case "jmp":
        iptr += instr[1];
        break;
    }

    if (iptr >= instrs.length) return [true, acc];
  }
}

function findAccumulatorAtTermination(input) {
  return runInstructions(parseInstructionList(input))[1];
}

// Determine which single instruction, when flipped between nop <=> jmp, results in a terminating run.
// Returns the accumulator when the flipped instruction set terminates.
function findTerminatingInstructionSet(input) {
  let instrs = parseInstructionList(input);

  for (index in instrs) {
    switch (instrs[index][0]) {
      case "nop":
        instrs[index][0] = "jmp";
        let jmpInstrResult = runInstructions(instrs);
        if (jmpInstrResult[0]) return jmpInstrResult[1];
        instrs[index][0] = "nop";
        break;
      case "jmp":
        instrs[index][0] = "nop";
        let nopInstrResult = runInstructions(instrs);
        if (nopInstrResult[0]) return nopInstrResult[1];
        instrs[index][0] = "jmp";
        break;
      default:
        break;
    }
  }
}

let input = fs.readFileSync('input.txt').toString().split('\n');

console.log(`Part one answer: ${findAccumulatorAtTermination(input)}`);
console.log(`Part two answer: ${findTerminatingInstructionSet(input)}`);