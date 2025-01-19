const _ = require('../../util/utils.js');

function updateCircuits(wires, circuits) {
  let anyChanged = false;

  for (let [wire1, operator, wire2, result] of circuits) {
    if (wires[result] !== undefined) continue;
    if (wires[wire1] === undefined || wires[wire2] === undefined) continue;

    if (operator === 'AND') wires[result] = wires[wire1] && wires[wire2];
    else if (operator === 'OR') wires[result] = wires[wire1] || wires[wire2];
    else if (operator === 'XOR') wires[result] = wires[wire1] !== wires[wire2];

    anyChanged = true;
  }

  return anyChanged;
}

function partOne(inputs, testMode) {
  let [initialWires, initialCircuits] = inputs.join('\n').split('\n\n');
  let wires = {}, circuits = [];

  for (let initialWire of initialWires.split('\n')) {
    let [, wire, state] = initialWire.match(/(.*): (\d)/);
    wires[wire] = state === '1';
  }

  for (let initialCircuit of initialCircuits.split('\n')) {
    let [, wire1, operator, wire2, result] = initialCircuit.split(/(.*) (\w+) (.*) -> (.*)/);
    circuits.push([wire1, operator, wire2, result]);
  }

  while (true) {
    let anyChanged = updateCircuits(wires, circuits);
    if (!anyChanged) break;
  }

  let answerWires = Object.keys(wires).filter(wire => wire.startsWith('z')).sort().reverse().map(wire => wires[wire] ? '1' : '0').join('');
  return Number.parseInt(answerWires, 2);
}

function findCircuit(circuits, expectedWire1, expectedOperator, expectedWire2) {
  console.log(`Searching for ${expectedWire1} ${expectedOperator} ${expectedWire2}`);

  return circuits.filter(([wire1, operator, wire2, result]) => 
    operator === expectedOperator && 
    ((wire1 === expectedWire1 && wire2 === expectedWire2) || (wire2 === expectedWire1 && wire1 === expectedWire2)))[0];
}

function isValidCircuits(circuits, numBits) {
  let carry = findCircuit(circuits, "x00", "AND", "y00")[3];

  // full adder taken from https://upload.wikimedia.org/wikipedia/commons/5/57/Fulladder.gif
  // xor   = x XOR y
  // z     = xor XOR carry
  // carry = (xor   AND carry) OR (x AND y)
  for (let i = 1; i < numBits; i++) {
    let num = i.toString().padStart(2, "0");

    let x = "x" + num;
    let y = "y" + num;
    let xor = findCircuit(circuits, x, "XOR", y)[3];
    
    let z = findCircuit(circuits, carry, "XOR", xor)[3];

    let xorAndC = findCircuit(circuits, xor, "AND", carry)[3];
    let and = findCircuit(circuits, x, "AND", y)[3];
    carry = findCircuit(circuits, and, "OR", xorAndC)[3];
  }
}

/*
I solved this in an absurd way:

I ran the problem without swaps, and looked at the console logs when an error occurred
a swap must be able to fix it, so I manually solved the full adder for the correct swap

then, I reran it and fixed the next error, 4 times
fortunately, all 4 swaps were between components of the same adder each time 
*/
const SWAPS = {
  'cnk': 'qwf',
  'qwf': 'cnk', // in z09 adder

  'z14': 'vhm',
  'vhm': 'z14',

  'z27': 'mps',
  'mps': 'z27',

  'z39': 'msq',
  'msq': 'z39'
};

function partTwo(inputs, testMode) {
  let [initialWires, initialCircuits] = inputs.join('\n').split('\n\n');
  let circuits = [];
  let maxWire = 'a00';

  for (let initialCircuit of initialCircuits.split('\n')) {
    let [, wire1, operator, wire2, result] = initialCircuit.split(/(.*) (\w+) (.*) -> (.*)/);

    if (SWAPS[result] !== undefined) result = SWAPS[result];

    circuits.push([wire1, operator, wire2, result]);
    if (result > maxWire) maxWire = result;
  }

  let numBits = Number(maxWire[1] + maxWire[2]);

  isValidCircuits(circuits, numBits);

  return Object.keys(SWAPS).sort();
}

module.exports = { partOne, partTwo };