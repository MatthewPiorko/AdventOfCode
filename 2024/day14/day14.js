const _ = require('../../util/utils.js');

function simulate(robots, width, height, numSteps) {
  for (let i = 0; i < robots.length; i++) {
    let [x, y, vx, vy] = robots[i];

    x = _.safeMod(x + (vx * numSteps), width);
    y = _.safeMod(y + (vy * numSteps), height);

    robots[i] = [x, y, vx, vy];
  }

  let topLeft = 0, topRight = 0, bottomLeft = 0, bottomRight = 0;
  let middleX = Math.floor(width / 2), middleY = Math.floor(height / 2);

  for (let [x, y, vx, vy] of robots) {
    if (x < middleX && y < middleY) topLeft++;
    if (x > middleX && y < middleY) topRight++;
    if (x < middleX && y > middleY) bottomLeft++;
    if (x > middleX && y > middleY) bottomRight++;
  }

  return topLeft * topRight * bottomLeft * bottomRight;
}

function partOne(inputs, testMode) {
  let robots = inputs.map(row => {
    let [_, x, y, vx, vy] = row.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/);
    return [Number(x), Number(y), Number(vx), Number(vy)];
  });

  return simulate(robots, testMode ? 11 : 101, testMode ? 7 : 103, 100);
}

function isOrdered(numbers) {
  x = 0;
  for (let i = 0; i < numbers.length - 1; i++) {
    if (numbers[i] < numbers[i + 1]) x++;
  }

  return x;
}

function findChristmas(robots, width, height) {
  let solutions = [];

  for (let iter = 1; iter < 10000; iter++) {
    for (let i = 0; i < robots.length; i++) {
      let [x, y, vx, vy] = robots[i];

      x = _.safeMod(x + vx, width);
      y = _.safeMod(y + vy, height);

      robots[i] = [x, y, vx, vy];
    }

    // if all the robots are separate, it's probably an image
    let locations = new Set();
    for (let i = 0; i < robots.length; i++) {
      let [x, y, vx, vy] = robots[i];
      locations.add(`${x},${y}`);
    }

    // on my input, it's actually the second time that they're all separate
    // so print out all possible solution for manual inspection
    if (locations.size === robots.length) {
      let grid = _.arr2D(width, height, '.');
      for (let i = 0; i < robots.length; i++) {
        let [x, y, vx, vy] = robots[i];
        grid[y][x] = '1';
      }
      _.print2D(grid);
      solutions.push(iter);
    }
  }

  return solutions[solutions.length - 1];
}

function partTwo(inputs, testMode) {
  let robots = inputs.map(row => {
    let [_, x, y, vx, vy] = row.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/);
    return [Number(x), Number(y), Number(vx), Number(vy)];
  });

  return findChristmas(robots, 101, 103);
}

module.exports = { partOne, partTwo };