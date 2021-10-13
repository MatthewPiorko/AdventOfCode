const OpCodes = {
  ADD: 1,
  MUL: 2,
  IN: 3,
  OUT: 4,
  JNZ: 5,
  JEZ: 6,
  TLT: 7,
  TEQ: 8,
  REL: 9,
  HLT: 99
};

const ParamTypes = {
  GET: 1,
  WRITE: 2
}

class OperationDefinition {
  constructor(opCode, length, paramTypes) {
    this.opCode = opCode;
    this.length = length;
    this.paramTypes = paramTypes;
  }
}

const OperationDefinitions = {
  "01": new OperationDefinition(OpCodes.ADD, 4, [ParamTypes.GET, ParamTypes.GET, ParamTypes.WRITE]),
  "02": new OperationDefinition(OpCodes.MUL, 4, [ParamTypes.GET, ParamTypes.GET, ParamTypes.WRITE]),
  "03": new OperationDefinition(OpCodes.IN, 2, [ParamTypes.WRITE]),
  "04": new OperationDefinition(OpCodes.OUT, 2, [ParamTypes.GET]),
  "05": new OperationDefinition(OpCodes.JNZ, 3, [ParamTypes.GET, ParamTypes.GET]),
  "06": new OperationDefinition(OpCodes.JEZ, 3, [ParamTypes.GET, ParamTypes.GET]),
  "07": new OperationDefinition(OpCodes.TLT, 4, [ParamTypes.GET, ParamTypes.GET, ParamTypes.WRITE]),
  "08": new OperationDefinition(OpCodes.TEQ, 4, [ParamTypes.GET, ParamTypes.GET, ParamTypes.WRITE]),
  "09": new OperationDefinition(OpCodes.REL, 2, [ParamTypes.GET]),
  "99": new OperationDefinition(OpCodes.HLT, 0, [])
};

class Operation {
  constructor(opCode, modes, length, parameters) {
    this.opCode = opCode;
    this.modes = modes;
    this.length = length;
    this.parameters = parameters;
  }
}

function createOperation(str, instrs, iptr, relativeBase) {
  let paddedStr = str.padStart(5, "0");
  let [_, modes, opCode] = paddedStr.match(/(\d{3})(\d{2})/);

  let definition = OperationDefinitions[opCode];
  modes = modes.split("").reverse();

  let parameters = parseParameters(instrs, modes, iptr, definition.length, relativeBase, definition.paramTypes);

  return new Operation(definition.opCode, modes, definition.length, parameters);
}

function parseParameters(instrs, modes, iptr, parameterNumber, relativeBase, paramTypes) {
  let parameters = [];

  for (let i = 1; i <= parameterNumber; i++) {
    let parameter = Number(instrs[iptr + i]);

    switch (paramTypes[i - 1]) {
      case ParamTypes.GET:
        switch (modes[i - 1]) {
          // Treat the parameter as an address, and get the value at that address
          case "0":
            parameter = Number(instrs[parameter]);
            break;
          // Treat the parameter as itself
          case "1":
            break;
          // Treat the parameter as an address relative to the base, and get the value there
          case "2":
            parameter = Number(instrs[parameter + relativeBase]);
            break;
        }
        break;
      case ParamTypes.WRITE:
        switch (modes[i - 1]) {
          // Treat the address as itself
          case "0":
          case "1":
            break;
          // Treat the address as relative to the base
          case "2":
            parameter = parameter + relativeBase;
        }
    }

    // If the parameter was undefined (out of bounds), it defaults to 0
    if (isNaN(parameter)) parameter = 0;

    parameters.push(parameter);
  }

  return parameters;
}

function runInstructions(sourceInstrs, inputCallback, outputCallback, debug = false) {
  let iptr = 0;
  let outputs = [];
  let instrs = sourceInstrs;
  let relativeBase = 0;

  while (iptr < instrs.length) {
    let operation = createOperation(instrs[iptr], instrs, iptr, relativeBase);
    let [p1, p2, p3] = operation.parameters;

    if (debug) { 
      console.log("-".repeat(10));
      console.log(`Instruction Pointer: ${iptr}`);
      console.log(operation);
      console.log(`Relative Base: ${relativeBase}`);
      console.log(`Raw Instruction: ${instrs[iptr]}`);
      console.log(instrs.slice(iptr, iptr + 4).join(',')); 
      console.log(outputs);
    }

    switch (operation.opCode) {
      case OpCodes.ADD:
        instrs[p3] = String(p1 + p2);  
        break;
      case OpCodes.MUL:
        instrs[p3] = String(p1 * p2);  
        break;
      case OpCodes.IN:
        instrs[p1] = String(inputCallback());
        break;
      case OpCodes.OUT:
        outputCallback(Number(p1));
        break;
      // For jump instructions, jump below the actual instruction so that it is correct when it increments
      case OpCodes.JNZ:
        if (p1 != 0) iptr = p2 - operation.length;
        break;
      case OpCodes.JEZ:
        if (p1 == 0) iptr = p2 - operation.length;
        break;
      case OpCodes.TLT:
        instrs[p3] = Number(p1 < p2);
        break;
      case OpCodes.TEQ:
        instrs[p3] = Number(p1 == p2);
        break;
      case OpCodes.REL:
        relativeBase += p1;
        break;
      case OpCodes.HLT:
        return outputs;
      default:
        return `error; invalid opcode ${operation.opcode}`;
    }

    iptr += operation.length;
  }

  return "error; program ran beyond last instruction without halting";
}

async function runInstructionsAsync(sourceInstrs, inputCallback, outputCallback, debug = false) {
  let iptr = 0;
  let outputs = [];
  let instrs = sourceInstrs;
  let relativeBase = 0;

  while (iptr < instrs.length) {
    let operation = createOperation(instrs[iptr], instrs, iptr, relativeBase);
    let [p1, p2, p3] = operation.parameters;

    if (debug) { 
      console.log("-".repeat(10));
      console.log(`Instruction Pointer: ${iptr}`);
      console.log(operation);
      console.log(`Relative Base: ${relativeBase}`);
      console.log(`Raw Instruction: ${instrs[iptr]}`);
      console.log(instrs.slice(iptr, iptr + 4).join(',')); 
      console.log(outputs);
    }

    switch (operation.opCode) {
      case OpCodes.ADD:
        instrs[p3] = String(p1 + p2);  
        break;
      case OpCodes.MUL:
        instrs[p3] = String(p1 * p2);  
        break;
      case OpCodes.IN:
        let input = String(await inputCallback());
        instrs[p1] = input;
        break;
      case OpCodes.OUT:
        outputCallback(Number(p1));
        break;
      // For jump instructions, jump below the actual instruction so that it is correct when it increments
      case OpCodes.JNZ:
        if (p1 != 0) iptr = p2 - operation.length;
        break;
      case OpCodes.JEZ:
        if (p1 == 0) iptr = p2 - operation.length;
        break;
      case OpCodes.TLT:
        instrs[p3] = Number(p1 < p2);
        break;
      case OpCodes.TEQ:
        instrs[p3] = Number(p1 == p2);
        break;
      case OpCodes.REL:
        relativeBase += p1;
        break;
      case OpCodes.HLT:
        return outputs;
      default:
        return `error; invalid opcode ${operation.opcode}`;
    }

    iptr += operation.length;
  }

  return "error; program ran beyond last instruction without halting";
}

// Run an instruction set on a constant list of inputs, returning a list of outputs
function runInstructionsOnList(instrs, inputs, debug = false) {
  let outputs = [];
  inputs = inputs.map(Number);

  let getInput = () => inputs.shift();
  let output = (int) => outputs.push(int);

  runInstructions(instrs, getInput, output, debug);

  return outputs;
}

module.exports = { runInstructions, runInstructionsOnList, runInstructionsAsync };