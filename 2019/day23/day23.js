const fs = require("fs");
const path = require("path");

const { runInstructionsAsync } = require("../common/intcode-compiler");

function runNetwork(instrs) {
  let inputs = {};
  let unprocessedInputs = {};
  let waitingMachines = new Set();

  let natYValues = [];

  let natX = undefined, natY = undefined;
  let isFinished = false;

  for (let i = 0; i < 50; i++) {
    inputs[i] = [i];
    unprocessedInputs[i] = [];
    waitingMachines[i] = 0;

    let getInput = () => {
      if (isFinished) throw "finished";

      let input = inputs[i].shift();

      if (input === undefined) {
        waitingMachines.add(i);

        if (waitingMachines.size === 50 && natX !== undefined && natY !== undefined && inputs[0].length === 0) {
          if (natYValues.length === 0) {
            console.log(`Part one answer: ${natY}`);
          } else if (natYValues[natYValues.length - 1] === natY) {
            console.log(`Part two answer: ${natY}`);
            isFinished = true;

            throw "finished";
          }

          natYValues.push(natY);

          inputs[0] = [natX, natY];
          natX = undefined;
          natY = undefined;
          waitingMachines = new Set();
        }

        return -1;
      } else {
        waitingMachines.delete(i);
        return input;
      }
    }

    let handleOutput = (val) => {
      unprocessedInputs[i].push(val);

      if (unprocessedInputs[i].length === 3) {
        let [addr, x, y] = unprocessedInputs[i];

        if (addr === 255) {          
          natX = x, natY = y;
        } else {
          inputs[addr] = inputs[addr].concat([x,y]);
        }

        unprocessedInputs[i] = [];
      }
    }

    runInstructionsAsync(instrs.map(String), getInput, handleOutput)
      .catch(err => {}); // Using an exception to complete the promise
  }

  return false;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);
  let instrs = input[0].trim().split(',').map(String);

  runNetwork(instrs);
}

module.exports = { main };