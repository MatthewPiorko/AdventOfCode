const fs = require("fs");
const path = require("path");

const { runInstructions } = require("../common/intcode-compiler");

function runRobot(instrs, input) {
  input = input.map(str => str + '\n').join('').split('').map(c => c.charCodeAt(0));
  instrs = instrs.map(String);

  let getInput = () => {
    let nextInput = input.shift();
    // console.log(`Inputting ${nextInput}`);
    return nextInput;
  }

  let out = "";
  let solution;
  let handleOutput = (intChar) => {
    // console.log(intChar);
    if (intChar > 255) {
      solution = intChar;
    }
    if (intChar === 10) {
      console.log(out);
      out = "";
    } else {
      out += String.fromCharCode(intChar);
    }
  }

  runInstructions(instrs, getInput, handleOutput);

  return solution;
}

function partOne(instrs) {
  // Jump if there a hole within 3 tiles, and the 4th tile is ground (to land on)
  // (!A OR !B OR !C) AND D
  let input = [
    "NOT A J",
    "NOT B T",
    "OR T J",
    "NOT C T",
    "OR T J",
    "AND D J",
    "WALK"
  ];

  return runRobot(instrs, input);
}

function partTwo(instrs) {
  // Jump if there a hole within 3 tiles, the 4th tile is ground (to land on), 
  //     and either the 5th tile is ground (to run on) or the 8th tile is ground (to jump to)
  // (!A OR !B OR !C) AND D AND (E OR H)
  let input = [
    "NOT A J",
    "NOT B T",
    "OR T J",
    "NOT C T",
    "OR T J",
    "AND D J",
    "AND E T",
    "OR H T",
    "AND T J",
    "RUN"
  ];

  return runRobot(instrs, input);
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);
  let instrs = input[0].trim().split(',').map(String);

  console.log(`Part one answer: ${partOne(instrs)}`);
  console.log(`Part one answer: ${partTwo(instrs)}`);
}

module.exports = { main };