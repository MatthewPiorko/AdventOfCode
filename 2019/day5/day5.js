const fs = require("fs");
const path = require("path");

class OpCode {
  constructor(str) {
    let paddedStr = str.padStart(5, "0");
    let [_, modes, opcode] = paddedStr.match(/(\d{3})(\d{2})/);
    this.opcode = opcode;
    this.modes = modes.split("").reverse();
  }
}

function parseParameters(instrs, modes, iptr, parameterNumber) {
  let parameters = [];

  for (let i = 1; i <= parameterNumber; i++) {
    switch (modes[i - 1]) {
      // Treat the parameter as an address, and get the value at that address
      case "0":
        parameters.push(Number(instrs[instrs[iptr + i]]));
        break;
      // Treat the parameter as an immediate value
      case "1":
        parameters.push(Number(instrs[iptr + i]));
        break;
    }
  }

  return parameters;
}

function runInstructions(sourceInstrs, inputs) {
  let iptr = 0;
  let outputs = [];
  let instrs = sourceInstrs.slice();

  while (iptr < instrs.length) {
    // console.log(instrs.join(','));
    let operation = new OpCode(instrs[iptr]);

    if (operation.opcode == "01") {
      let [firstParameter, secondParameter] = parseParameters(instrs, operation.modes, iptr, 2);

      instrs[instrs[iptr + 3]] = String(firstParameter + secondParameter);
      iptr += 4;
    } else if (operation.opcode == "02") {
      let [firstParameter, secondParameter] = parseParameters(instrs, operation.modes, iptr, 2);

      instrs[instrs[iptr + 3]] = String(firstParameter * secondParameter);
      iptr += 4;
    } else if (operation.opcode == "03") {
      let argument = instrs[iptr + 1];
      instrs[argument] = String(inputs[0]);
      inputs = inputs.slice(1);
      iptr += 2;
    } else if (operation.opcode == "04") {
      let [parameter] = parseParameters(instrs, operation.modes, iptr, 1);
      outputs.push(Number(parameter));
      iptr += 2;
    } else if (operation.opcode == "05") {
      let [firstParameter, secondParameter] = parseParameters(instrs, operation.modes, iptr, 2);

      if (firstParameter != 0) iptr = secondParameter;
      else iptr += 3;
    } else if (operation.opcode == "06") {
      let [firstParameter, secondParameter] = parseParameters(instrs, operation.modes, iptr, 2);

      if (firstParameter == 0) iptr = secondParameter;
      else iptr += 3;
    } else if (operation.opcode == "07") {
      let [firstParameter, secondParameter] = parseParameters(instrs, operation.modes, iptr, 2);
      let thirdParameter = Number(instrs[iptr + 3]);
      
      if (firstParameter < secondParameter) instrs[thirdParameter] = 1;
      else instrs[thirdParameter] = 0;

      iptr += 4;
    } else if (operation.opcode == "08") {
      let [firstParameter, secondParameter] = parseParameters(instrs, operation.modes, iptr, 2);
      let thirdParameter = Number(instrs[iptr + 3]);

      if (firstParameter == secondParameter) instrs[thirdParameter] = 1;
      else instrs[thirdParameter] = 0;

      iptr += 4;
    } else if (operation.opcode == "99") {
      return outputs;
    } else {
      return "error";
    }
  }
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split('\n');
  let instrs = input[0].trim().split(',');

  console.log(`Part one answer: ${runInstructions(instrs, ["1"])}`);
  console.log(`Part two answer: ${runInstructions(instrs, ["5"])}`);
}

module.exports = { main };