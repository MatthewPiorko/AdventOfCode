const _ = require('../../util/utils.js');

const OBJECTS = {
  EMPTY: '.',
  SPLITTER: '^',
  START: 'S'
};

function partOne(inputs, testMode) {
  let grid = inputs.map(row => row.split(''));
  let tachyons = [_.find2D(grid, OBJECTS.START)];
  
  let splittersHit = new Set();
  let visited = new Set();

  while (tachyons.length > 0) {
    let [x,y] = tachyons.pop();
    let key = `${x},${y}`;

    if (y > grid.length - 1) continue;

    if (visited.has(key)) continue;
    visited.add(key);

    if (grid[y][x] === OBJECTS.SPLITTER) {
      splittersHit.add(key);
      tachyons.push([x - 1, y]);
      tachyons.push([x + 1, y]);
    } else {
      tachyons.push([x, y + 1]);
    }
  }

  return splittersHit.size;
}

function partTwo(inputs, testMode) {
  let grid = inputs.map(row => row.split(''));
  let start = _.find2D(grid, OBJECTS.START);

  return numTimelines(grid, start);
}

function cachedFunction(func, keyGenerator, cache, ...params) {
  let key = keyGenerator(...params);
  if (cache[key] !== undefined) return cache[key];

  let val = func(...params);
  cache[key] = val;
  return val;
}

function uncachedNumTimelines(grid, [x, y]) {
  if (y > grid.length - 1) return 1;

  if (grid[y][x] !== OBJECTS.SPLITTER) return numTimelines(grid, [x, y + 1]);

  let leftTimelines = numTimelines(grid, [x - 1, y]);
  let rightTimelines = numTimelines(grid, [x + 1, y]);

  return leftTimelines + rightTimelines;
}

let timelinesCache = {};
let numTimelines = (grid, [x, y]) => cachedFunction(uncachedNumTimelines, (grid, [x, y]) => `${x},${y}`, timelinesCache, grid, [x, y]);

module.exports = { partOne, partTwo };