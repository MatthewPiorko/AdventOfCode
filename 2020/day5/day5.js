const fs = require("fs");
const path = require("path");

const ROW_LETTER_TO_BINARY = { "F": 0, "B": 1 };
const COLUMN_LETTER_TO_BINARY = { "L": 0, "R": 1 };

function computeSeatId(seatString) {
  let rowBinary = seatString.substring(0, 7).split('').map(char => ROW_LETTER_TO_BINARY[char]).join('');
  let colBinary = seatString.substring(7).split('').map(char => COLUMN_LETTER_TO_BINARY[char]).join('');

  let row = parseInt(rowBinary, 2), col = parseInt(colBinary, 2);
  let seatId = row * 8 + col;
  return seatId;
}

function findMissingSeatId(seatIds) {
  let seatIdSet = new Set();

  for (seatId of seatIds) seatIdSet.add(seatId);

  for (row = 0; row < 127; row++) {
    for (column = 0; column < 8; column++) {
      let seatId = row * 8 + column;

      if (!seatIdSet.has(seatId) && 
        seatIdSet.has(seatId - 1) && seatIdSet.has(seatId + 1)) return seatId;
    }
  }
}

function main() {
  fs.readFile(path.resolve(__dirname, 'input.txt'), function (err, data) {
    let input = data.toString().split('\n').map(s => s.trim());
    let seatIds = input.map(computeSeatId);

    console.log(seatIds.reduce((acc, val) => Math.max(acc, val), 0));
    console.log(findMissingSeatId(seatIds));
  });
}

module.exports = { main };