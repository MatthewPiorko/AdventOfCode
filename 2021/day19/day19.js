const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

// This includes some invalid transforms (total 48 instead of 24)
let DIRECTIONS = [-1,1];
let ROTATIONS = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];

function getAlignments() {
  let alignments = [];

  for (let x of DIRECTIONS) {
    for (let y of DIRECTIONS) {
      for (let z of DIRECTIONS) {
        for (let rot of ROTATIONS) {
          alignments.push([x,y,z,rot]);
        }
      }
    }
  }

  return alignments;
}

const ALIGNMENTS = getAlignments();

function parseScanners(inputs) {
  inputs  = inputs.split(/\r?\n\r?\n/);

  return inputs.map(scanner => {
    let coords = scanner.split(/\r?\n/).slice(1);
    return coords.map(coord => {
      let [group, x, y, z] = coord.match(/(-?\d+),(-?\d+),(-?\d+)/);
      return [Number(x), Number(y), Number(z)];
    });
  });
}

// Translate and rotate 3d coordinate to the given alignment
function align(alignment, coords) {
  let [xDir, yDir, zDir, [xIdx, yIdx, zIdx]] = alignment;
  return [coords[xIdx] * xDir, coords[yIdx] * yDir, coords[zIdx] * zDir];
}

// Since 12 are required to match, if 13 coords have been checked, then at most only 11 can align. So, they don't need to be checked
const NUM_COORDS_TO_SEARCH = 25 - 12; 

// Determine if the scanners overlap in any alignment
// Returns [doesOverlap, scannerPos, alignment]
function determineIfAnyOverlap(sourceScanner, originalScanner) {
  let beacons = new Set();
  for (let [x,y,z] of sourceScanner) {
    beacons.add(`${x},${y},${z}`);
  }

  for (let [startingX, startingY, startingZ] of sourceScanner.slice(0, NUM_COORDS_TO_SEARCH)) {
    for (let alignment of ALIGNMENTS) {
      let [xDir, yDir, zDir, [xIdx, yIdx, zIdx]] = alignment;
      let scanner = originalScanner.map(coords => align(alignment, coords));

      for (let [scannerX, scannerY, scannerZ] of scanner.slice(0, NUM_COORDS_TO_SEARCH)) {
        // Shift coordinate plane to the expected plane
        let deltaX = startingX - scannerX, deltaY = startingY - scannerY, deltaZ = startingZ - scannerZ;
        let shiftedScanner = scanner.map(coords => [coords[0] + deltaX, coords[1] + deltaY, coords[2] + deltaZ]);

        let overlap = shiftedScanner.filter(([x,y,z]) => beacons.has(`${x},${y},${z}`)).length;
        if (overlap >= 12) return [true, [deltaX, deltaY, deltaZ], alignment];
      }
    }
  }

  return [false, undefined, undefined];
}

function scanTrench(inputs) {
  let scanners = parseScanners(inputs);

  // Start with a reference frame of the first scanner
  let solved = new Set([0]);
  let nextToCheck = [0];
  let scannerPositions = [[0,0,0]];

  // Align any possible scanners to the currently known ones
  while (nextToCheck.length > 0) {
    let i = nextToCheck.pop();
    for (let j = 0; j < scanners.length; j++) {
      if (solved.has(j)) continue; // Ignore already solved solutions

      console.log(`Checking for overlap between ${i} and ${j}`);
      let [doesOverlap, scannerPos, alignment] = determineIfAnyOverlap(scanners[i], scanners[j]);
      if (!doesOverlap) continue;

      solved.add(j);
      nextToCheck.push(j);
      scannerPositions.push(scannerPos);

      // Shift all beacons of scanner to align with the original alignment
      scanners[j] = scanners[j].map(coords => {
        let [x,y,z] = align(alignment, coords);
        return [x + scannerPos[0], y + scannerPos[1], z + scannerPos[2]];
      });
    }
  }

  console.log(`Aligned ${solved.size} of ${scanners.length} scanners`);

  let allBeacons = new Set();
  for (let i = 0; i < scanners.length; i++) {
    for (let [x,y,z] of scanners[i]) {
      allBeacons.add(`${x},${y},${z}`);
    }
  }

  console.log(`Part one answer: ${allBeacons.size}`);

  let maximumOverlap = -Infinity;
  for (let i = 0; i < scannerPositions.length; i++) {
    for (let j = i + 1; j < scannerPositions.length; j++) {
      let distance = Math.abs(scannerPositions[i][0] - scannerPositions[j][0]) + Math.abs(scannerPositions[i][1] - scannerPositions[j][1]) + Math.abs(scannerPositions[i][2] - scannerPositions[j][2]);
      maximumOverlap = Math.max(maximumOverlap, distance);
    }
  }

  console.log(`Part two answer: ${maximumOverlap}`);
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim();

  scanTrench(inputs);
}

module.exports = { main };