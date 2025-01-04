const _ = require('../../util/utils.js');

const OBJECTS = {
  WALL: '#',
  BOX: 'O',
  ROBOT: '@',
  EMPTY: '.',
  LEFT_BOX: '[',
  RIGHT_BOX: ']'
};

const DIRECTIONS = {
  '^': [0, -1],
  '>': [1, 0],
  'v': [0, 1],
  '<': [-1, 0]
};

const EXPANSION = {
  '#': '##',
  'O': '[]',
  '@': '@.',
  '.': '..'
};

function partOne(inputs, testMode) {
  inputs = inputs.join('\n').split('\n\n');
  let grid = inputs[0].split('\n').map(row => row.split(''));
  let directions = inputs[1].split('\n').join('');

  let [x, y] = _.find2D(grid, OBJECTS.ROBOT);
  grid[y][x] = OBJECTS.EMPTY;

  for (let direction of directions) {
    let [dx, dy] = DIRECTIONS[direction];
    let obj = grid[y + dy][x + dx];

    if (obj === OBJECTS.EMPTY) {
      x += dx, y += dy;
    } else if (obj === OBJECTS.BOX) {
      let numBoxes = 1;
      while (true) {
        obj = grid[y + (dy * numBoxes)][x + (dx * numBoxes)];
        if (obj === OBJECTS.BOX) {
          numBoxes++;
          continue;
        } else if (obj === OBJECTS.WALL) {
          break;
        } else if (obj === OBJECTS.EMPTY) {
          // moving all the boxes one space, is equivalent to putting a box at the end & removing the front
          grid[y + (dy * numBoxes)][x + (dx * numBoxes)] = OBJECTS.BOX;
          grid[y + dy][x + dx] = OBJECTS.EMPTY;
          x += dx, y += dy;
          break;
        }
      }
    }
  }

  let coords = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === OBJECTS.BOX) coords += ((100 * y) + x);
    }
  }

  return coords;
}

function canMoveLeft(grid, x, y) {
  let obj = _.safeGet2D(grid, x - 1, y);

  if (obj === OBJECTS.EMPTY) return true;
  if (obj == OBJECTS.RIGHT_BOX) return canMoveLeft(grid, x - 2, y);

  return false;
}

function moveLeft(grid, x, y) {
  let obj = _.safeGet2D(grid, x - 1, y);

  if (obj == OBJECTS.RIGHT_BOX) moveLeft(grid, x - 2, y);

  grid[y][x - 1] = OBJECTS.LEFT_BOX;
  grid[y][x] = OBJECTS.RIGHT_BOX;
  grid[y][x + 1] = OBJECTS.EMPTY;
}

function canMoveRight(grid, x, y) {
  let obj = _.safeGet2D(grid, x + 2, y);

  if (obj === OBJECTS.EMPTY) return true;
  if (obj == OBJECTS.LEFT_BOX) return canMoveRight(grid, x + 2, y);

  return false;
}

function moveRight(grid, x, y) {
  let obj = _.safeGet2D(grid, x + 2, y);

  if (obj == OBJECTS.LEFT_BOX) moveRight(grid, x + 2, y);

  grid[y][x + 1] = OBJECTS.LEFT_BOX;
  grid[y][x + 2] = OBJECTS.RIGHT_BOX;
  grid[y][x] = OBJECTS.EMPTY;
}

function canMoveVertical(grid, x, y, dy) {
  let obj1 = _.safeGet2D(grid, x, y + dy);
  let obj2 = _.safeGet2D(grid, x + 1, y + dy);

  if (obj1 === OBJECTS.EMPTY && obj2 === OBJECTS.EMPTY) return true;
  else if (obj1 === OBJECTS.LEFT_BOX) return canMoveVertical(grid, x, y + dy, dy);
  else if (obj1 === OBJECTS.RIGHT_BOX && obj2 === OBJECTS.LEFT_BOX) {
    return canMoveVertical(grid, x - 1, y + dy, dy) && canMoveVertical(grid, x + 1, y + dy, dy);
  }
  else if (obj1 === OBJECTS.RIGHT_BOX && obj2 === OBJECTS.EMPTY) return canMoveVertical(grid, x - 1, y + dy, dy);
  else if (obj2 === OBJECTS.LEFT_BOX && obj1 === OBJECTS.EMPTY) return canMoveVertical(grid, x + 1, y + dy, dy);

  return false;
}

function moveVertical(grid, x, y, dy) {
  let obj1 = _.safeGet2D(grid, x, y + dy);
  let obj2 = _.safeGet2D(grid, x + 1, y + dy);

  if (obj1 === OBJECTS.LEFT_BOX) moveVertical(grid, x, y + dy, dy);
  if (obj1 === OBJECTS.RIGHT_BOX) moveVertical(grid, x - 1, y + dy, dy);
  if (obj2 === OBJECTS.LEFT_BOX) moveVertical(grid, x + 1, y + dy, dy);

  grid[y + dy][x] = OBJECTS.LEFT_BOX;
  grid[y + dy][x + 1] = OBJECTS.RIGHT_BOX;
  grid[y][x] = OBJECTS.EMPTY;
  grid[y][x + 1] = OBJECTS.EMPTY;
}

function partTwo(inputs, testMode) {
  inputs = inputs.join('\n').split('\n\n');
  let grid = inputs[0].split('\n').map(row => row.split('').map(x => EXPANSION[x]).join('').split(''));
  let directions = inputs[1].split('\n').join('');

  let [x, y] = _.find2D(grid, OBJECTS.ROBOT);
  grid[y][x] = OBJECTS.EMPTY;

  for (let direction of directions) {
    let [dx, dy] = DIRECTIONS[direction];
    let obj = grid[y + dy][x + dx];

    if (obj === OBJECTS.EMPTY) {
      x += dx, y += dy;
    } else if (obj === OBJECTS.LEFT_BOX || obj === OBJECTS.RIGHT_BOX) {
      if (dx === -1 && canMoveLeft(grid, x - 2, y)) {
        moveLeft(grid, x - 2, y);
        x += dx, y += dy;
      }
      else if (dx === 1 && canMoveRight(grid, x + 1, y)) {
        moveRight(grid, x + 1, y);
        x += dx, y += dy;
      }
      else if (dx === 0 && obj === OBJECTS.LEFT_BOX && canMoveVertical(grid, x, y + dy, dy)) {
        moveVertical(grid, x, y + dy, dy);
        x += dx, y += dy;
      }
      else if (dx === 0 && obj === OBJECTS.RIGHT_BOX && canMoveVertical(grid, x - 1, y + dy, dy)) {
        moveVertical(grid, x - 1, y + dy, dy);
        x += dx, y += dy;
      }
    }
  }

  let coords = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === OBJECTS.LEFT_BOX) coords += ((100 * y) + x);
    }
  }

  return coords;
}

module.exports = { partOne, partTwo };