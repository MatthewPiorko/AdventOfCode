const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function isDescendable(map, x, y, newX, newY) {
  let diff = map[newY][newX].charCodeAt(0) - map[y][x].charCodeAt(0);
  return diff >= -1;
}

function findChar(map, char) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === char) return [x, y];
    }
  }
}

// perform a BFS from the goal to the start
function partOne(inputs) {
  inputs = inputs.map(input => input.split(''));
  let visited = {};

  let start = findChar(inputs, 'S');
  inputs[start[1]][start[0]] = 'a';

  let goal = findChar(inputs, 'E');
  inputs[goal[1]][goal[0]] = 'z';

  let frontier = [[goal[0], goal[1], 0]];

  while (frontier.length > 0) {
    let [x, y, dist] = frontier.shift();

    // don't revisit nodes unless this path is shorter
    let key = `${x},${y}`;
    if (visited[key] <= dist) continue;
    visited[key] = dist;

    // if this is the goal, then end this path's search
    if (x === start[0] && y === start[1]) continue;

    for (let [deltaX, deltaY] of _.ORTHOGONAL_ADJ) {
      let char = _.safeGet2D(inputs, x + deltaX, y + deltaY);
      if (char === undefined || !isDescendable(inputs, x, y, x + deltaX, y + deltaY)) continue;

      frontier.push([x + deltaX, y + deltaY, dist + 1]);
    }
  }

  return visited[`${start[0]},${start[1]}`];
}

// perform a BFS from the goal to the closest 'a' elevation
function partTwo(inputs) {
  inputs = inputs.map(input => input.split(''));
  let visited = {};
  let bestA = +Infinity;

  let goal = findChar(inputs, 'E');
  inputs[goal[1]][goal[0]] = 'z';

  let frontier = [[goal[0], goal[1], 0]];

  while (frontier.length > 0) {
    let [x, y, dist] = frontier.shift();

    // don't revisit nodes unless this path is shorter
    let key = `${x},${y}`;
    if (visited[key] <= dist) continue;
    visited[key] = dist;

    // if any 'a' is more easily reachable than anything on this path, stop using this path
    if (dist >= bestA) continue;

    // once an 'a' is found, that's the shortest 'a' on this path
    if (inputs[y][x] === 'a') {
      bestA = Math.min(bestA, dist);
      continue;
    }

    for (let [deltaX, deltaY] of _.ORTHOGONAL_ADJ) {
      let char = _.safeGet2D(inputs, x + deltaX, y + deltaY);
      if (char === undefined || !isDescendable(inputs, x, y, x + deltaX, y + deltaY)) continue;

      frontier.push([x + deltaX, y + deltaY, dist + 1]);
    }
  }

  return bestA;
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  let partOneStart = performance.now();
  console.log(`Part one answer: ${partOne(inputs)} (took ${(performance.now() - partOneStart).toFixed(0)}ms)`);

  let partTwoStart = performance.now()
  console.log(`Part two answer: ${partTwo(inputs)} (took ${(performance.now() - partTwoStart).toFixed(0)}ms)`);
}

module.exports = { main };