const _ = require('../../util/utils.js');

const OBJECTS = {
  FILLED: '#',
  EMPTY: '.'
};

function parseSchematic(schematic) {
  let heights = [];
  for (let x = 0; x < schematic[0].length; x++) {
    let height = 0;
    for (let y = 0; y < schematic.length; y++) {
      if (schematic[y][x] === OBJECTS.FILLED) height++;
    }
    heights.push(height - 1);
  }

  return heights;
}

function keyFitsLock(key, lock) {
  for (let i = 0; i < key.length; i++) {
    if (key[i] + lock[i] > 5) return false;
  }

  return true;
}

function partOne(inputs, testMode) {
  let keys = [], locks = [];

  for (let input of inputs.join('\n').split('\n\n')) {
    input = input.split('\n').map(row => row.split(''));
    schematic = parseSchematic(input);

    if (input[0][0] === OBJECTS.FILLED) locks.push(schematic);
    else keys.push(schematic);
  }

  let numFits = 0;
  for (let key of keys) {
    for (let lock of locks) {
      if (keyFitsLock(key, lock)) numFits++;
    }
  }

  return numFits;
}

function partTwo(inputs, testMode) {
  return undefined;
}

module.exports = { partOne, partTwo };