const _ = require('../../util/utils.js');

function partOne(inputs, testMode) {
  let sequence = inputs[0].split(",");

  return _.sum(sequence.map(hash));
}

function hash(str) {
  let val = 0;

  for (let i = 0; i < str.length; i++) {
    val += str.charCodeAt(i);
    val *= 17;
    val = val - (Math.floor(val / 256) * 256);
  }

  return val;
}

function partTwo(inputs, testMode) {
  let sequence = inputs[0].split(",");
  // boxes are an array of slots
  // slots are an array of [label, lens]
  let boxes = Array(256);
  for (let i = 0; i < boxes.length; i++) boxes[i] = [];

  for (let i = 0; i < sequence.length; i++) {
    let operation = sequence[i];
    operation.includes("=") ? handleEquals(boxes, operation) : handleDash(boxes, operation);
  }

  let power = 0;
  for (let boxIdx = 0; boxIdx < boxes.length; boxIdx++) {
    for (let slotIdx = 0; slotIdx < boxes[boxIdx].length; slotIdx++) {
      // boxes and slots should be 1-indexed
      power += (boxIdx + 1) * (slotIdx + 1) * boxes[boxIdx][slotIdx][1];
    }
  }

  return power;
}

function handleEquals(boxes, operation) {
  let [_, str, lens] = operation.match(/(\w+)=(\d+)/);
  let boxIdx = hash(str);
  let slotIdx = boxes[boxIdx].findIndex(slot => slot[0] === str);

  // add the label and lens to this slot
  if (slotIdx < 0) boxes[boxIdx].push([str, lens]);
  // replace the lens in this slot
  else boxes[boxIdx][slotIdx][1] = lens;
}

function handleDash(boxes, operation) {
  let [_, str] = operation.match(/(\w+)-/);
  let boxIdx = hash(str);
  let slotIdx = boxes[boxIdx].findIndex(slot => slot[0] === str);

  //remove the lens from that box
  if (slotIdx >= 0) boxes[boxIdx] = [...boxes[boxIdx].slice(0, slotIdx), ...boxes[boxIdx].slice(slotIdx + 1)];
}

module.exports = { partOne, partTwo };