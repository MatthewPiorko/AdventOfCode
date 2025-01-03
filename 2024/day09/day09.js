const _ = require('../../util/utils.js');

const OBJECTS = {
  EMPTY: '.'
};

function parseDisk(inputs) {
  let map = inputs[0].split('').map(x => Number(x));
  let fileId = 0;
  let disk = [];
  let lengths = {};

  for (let i = 0; i < map.length; i+=2) {
    let fileLength = map[i];
    let emptyLength = map[i + 1];

    lengths[fileId] = fileLength;
    disk = disk.concat(new Array(fileLength).fill(fileId));
    fileId++;
    if (emptyLength > 0) disk = disk.concat(new Array(emptyLength).fill(OBJECTS.EMPTY));
  }

  // returns 1D disk, max fileId, and dictionary of fileId -> fileLength
  return [disk, fileId - 1, lengths];
}

let checksum = (disk) => _.sum(disk.map((val, i) => val !== OBJECTS.EMPTY ? (val * i) : 0));

function partOne(inputs, testMode) {
  let [disk] = parseDisk(inputs);
  let start = 0, end = disk.length - 1;

  while (start < end) {
    if (disk[start] === OBJECTS.EMPTY && disk[end] !== OBJECTS.EMPTY) {
      disk[start] = disk[end];
      disk[end] = OBJECTS.EMPTY;
      end--;
    } else if (disk[start] !== OBJECTS.EMPTY) {
      start++;
    } else if (disk[end] === OBJECTS.EMPTY) {
      end--;
    }
  }

  return checksum(disk);
}

function partTwo(inputs, testMode) {
  let [disk, maxFileId, lengths] = parseDisk(inputs);

  for (let targetFileId = maxFileId; targetFileId >= 0; targetFileId--) {
    for (let i = 0; i < disk.length; i++) {
      if (disk[i] === targetFileId) break; // don't try to put a file after it's original location
      if (disk[i] !== OBJECTS.EMPTY) continue;

      let canFit = true;
      for (let j = 1; j < lengths[targetFileId]; j++) {
        if (disk[i + j] !== OBJECTS.EMPTY) {
          canFit = false;
          break;
        }
      }

      if (!canFit) continue;

      // replace the old file with empty
      for (let n = 0; n < disk.length; n++) {
        if (disk[n] === targetFileId) disk[n] = OBJECTS.EMPTY;
      }
      // replace the new location with the file
      for (let j = 0; j < lengths[targetFileId]; j++) {
        disk[i + j] = targetFileId;
      }
      break;
    }
  }

  return checksum(disk);
}

module.exports = { partOne, partTwo };