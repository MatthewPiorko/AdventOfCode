const fs = require("fs");
const path = require("path");

// Create all permutations [-1,0,+1] of length numRemaining
function generateDirectionPermutations(numRemaining) {
  if (numRemaining == 0) return [[]];

  let subPermutations = generateDirectionPermutations(numRemaining - 1);

  return subPermutations.reduce((permutations, perm) => {
    permutations.push([-1, ...perm]);
    permutations.push([0, ...perm]);
    permutations.push([1, ...perm]);

  return permutations;
  }, []);
}

// Generate all directions that would result in neighbors of dim dimensions
function generateNeighborDirections(dim) {
  let permutations = generateDirectionPermutations(dim);

  // The permutation of [0,0,..,0] is not a neighbor
  return permutations.filter(perm => !perm.every(char => char == 0));
}

function safeGet3D(cube, z, y, x) {
  let isValidZ = z >= 0 && z < cube.length;
  let isValidY = y >= 0 && y < cube[0].length;
  let isValidX = x >= 0 && x < cube[0][0].length;

  if (isValidX && isValidY && isValidZ) {
    return cube[z][y][x];
  }

  return '.';
}

function countDirectlyAdjacent3D(state, x, y, z, directions) {
  return directions.reduce((acc, [dirX, dirY, dirZ]) =>
    safeGet3D(state, z + dirZ, y + dirY, x + dirX) == '#' ? acc + 1 : acc, 0);
}

function determineNextState(currentState, numAdjacent) {
  if (currentState == '#' && (numAdjacent == 2 || numAdjacent == 3)) {
    return '#';
  }

  if (currentState == '.' && numAdjacent == 3) {
    return '#';
  }

  return '.';
}

function advance3DCycles(input, numCycles) {
  // cube is a 3-dimensional array of form cube[z][y][x]

  let cube = [];
  cube[0] = input.map(row => row.split(''));

  let directions = generateNeighborDirections(3);

  for (let count = 0; count < numCycles; count++) {
    let newCube = [];

    for (let z = -1; z <= cube.length; z++) {
      let newLayer = [];
      for (let y = -1; y <= cube[0].length; y++) {
        let newRow = [];
        for (let x = -1; x <= cube[0][0].length; x++) {
          let numAdjacent = countDirectlyAdjacent3D(cube, x, y, z, directions);
          let current = safeGet3D(cube, z, y, x);

          newRow.push(determineNextState(current, numAdjacent));
        }

        newLayer.push(newRow);
      }

      newCube.push(newLayer);
    }

    cube = newCube;
  }

  return cube.reduce((zAcc, z) => zAcc + 
      z.reduce((yAcc, y) => yAcc + 
        y.reduce((xAcc, x) => xAcc + (x == '#'), 0), 0), 0);
}

function safeGet4D(cube, w, z, y, x) {
  let isValidW = w >= 0 && w < cube.length;
  let isValidZ = z >= 0 && z < cube[0].length;
  let isValidY = y >= 0 && y < cube[0][0].length;
  let isValidX = x >= 0 && x < cube[0][0][0].length;

  if (isValidX && isValidY && isValidZ && isValidW) {
    return cube[w][z][y][x];
  }

  return '.';
}

function countDirectlyAdjacent4D(state, x, y, z, w, directions) {
  return directions.reduce((acc, [dirX, dirY, dirZ, dirW]) =>
    safeGet4D(state, w + dirW, z + dirZ, y + dirY, x + dirX) == '#' ? acc + 1 : acc, 0);
}

function advance4DCycles(input, numCycles) {
  // cube is a 4-dimensional array of form cube[w][z][y][x]

  // The initial dimension slice is at (w=0,z=0)
  let cube = [[]];
  cube[0][0] = input.map(row => row.split(''));

  let directions = generateNeighborDirections(4);

  for (let count = 0; count < numCycles; count++) {
    let newCube = [];

    for (let w = -1; w <= cube.length; w++) {
      let newW = [];

      for (let z = -1; z <= cube[0].length; z++) {
        let newLayer = [];
        for (let y = -1; y <= cube[0][0].length; y++) {
          let newRow = [];
          for (let x = -1; x <= cube[0][0][0].length; x++) {
            let numAdj = countDirectlyAdjacent4D(cube, x, y, z, w, directions);
            let cur = safeGet4D(cube, w, z, y, x);

            newRow.push(determineNextState(cur, numAdj));
          }

          newLayer.push(newRow);
        }

        newW.push(newLayer);
      }

      newCube.push(newW);
    }

    cube = newCube;
  }

  return cube.reduce((wAcc, w) => wAcc + 
    w.reduce((zAcc, z) => zAcc + 
      z.reduce((yAcc, y) => yAcc + 
        y.reduce((xAcc, x) => xAcc + (x == '#'), 0), 0), 0), 0);
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);

  console.log(`Part one answer: ${advance3DCycles(input, 6)}`);
  console.log(`Part two answer: ${advance4DCycles(input, 6)}`);
}

module.exports = { main };