const _ = require('../../util/utils.js');

const LITERAL_OPCODES = new Set([1, 3, 4]);

const OPCODES = {
  ADV: 0,
  BXL: 1,
  BST: 2,
  JNZ: 3,
  BXC: 4,
  OUT: 5,
  BDV: 6,
  CDV: 7
};

function runProgram(a, b, c, instrs) {
  let iptr = 0;
  let out = [];

  while (true) {
    if (iptr > instrs.length - 1) return out;

    let opcode = instrs[iptr];
    let operand = instrs[iptr + 1];

    if (!LITERAL_OPCODES.has(opcode)) {
      if (operand === 4) operand = a;
      else if (operand === 5) operand = b;
      else if (operand === 6) operand = c;
    }

    switch (opcode) {
      case OPCODES.ADV:
        a = Math.floor(a / (Math.pow(2, operand)));
        break;
      case OPCODES.BXL:
        b = b ^ operand;
        break;
      case OPCODES.BST:
        b = _.safeMod(operand, 8);
        break;
      case OPCODES.JNZ:
        if (a !== 0) iptr = operand - 2;
        break;
      case OPCODES.BXC:
        b = b ^ c;
        break;
      case OPCODES.OUT:
        out.push(_.safeMod(operand, 8));
        break;
      case OPCODES.BDV:
        b = Math.floor(a / (Math.pow(2, operand)));
        break;
      case OPCODES.CDV:
        c = Math.floor(a / (Math.pow(2, operand)));
        break;
    }

    iptr += 2;
  }
}

function partOne(inputs, testMode) {
  let [, a] = inputs[0].match(/Register A: (\d+)/);
  let [, b] = inputs[1].match(/Register B: (\d+)/);
  let [, c] = inputs[2].match(/Register C: (\d+)/);
  let [, instrs] = inputs[4].match(/Program: (.*)/);
  instrs = instrs.split('').filter(x => x !== ',').map(Number);

  return runProgram(a, b, c, instrs).join(',');
}

function octalToDecimal(list) {
  let num = 0, mul = 1;
  for (let i = list.length - 1; i >= 0; i--) {
    num += (list[i] * mul);
    mul *= 8;
  }

  return num;
}

// the program is generally laid out as:
// B = A % 8
// B = (some manipulation of B)
// OUTPUT B
// A = A / 8
// JNZ

// in other words,
// the output has one entry per every 3 bits of the number, because of the "A % 8" and "A / 8" instrs
// the first three bits correspond to the last output, the second three bits to the second to last output, etc
// so, solve the three bit octal numbers in order
function isSolvable(current, index, b, c, instrs) {
  if (index > instrs.length - 1) return [true, current];

  for (let i = 0; i < 8; i++) {
    current[index] = i;
    let val = runProgram(octalToDecimal(current), b, c, instrs);
    if (val[instrs.length - 1 - index] === instrs[instrs.length - 1 - index]) {
      let [isSubSolvable, subSolve] = isSolvable(current.map(x => x), index + 1, b, c, instrs);
      // some three bit numbers map to the same output number, so check all
      if (isSubSolvable) {
        return [true, subSolve];
      }
    }
  }

  return [false, undefined];
}

function partTwo(inputs, testMode) {
  let [, b] = inputs[1].match(/Register B: (\d+)/);
  let [, c] = inputs[2].match(/Register C: (\d+)/);
  let [, instrs] = inputs[4].match(/Program: (.*)/);
  instrs = instrs.split('').filter(x => x !== ',').map(Number);

  // start with the lowest possible number that produces enough outputs, 10000...0
  let possibilities = new Array(instrs.length).fill(0);
  possibilities[0] = 1;

  let [hasSolution, solution] = isSolvable(possibilities, 0, b, c, instrs);
  if (hasSolution) return octalToDecimal(solution);
}

module.exports = { partOne, partTwo };