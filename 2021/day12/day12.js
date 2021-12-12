const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

const START = 'start';
const END = 'end';

function parsePaths(inputs) {
  return inputs.reduce((paths, input) => {
    let [group, from, to] = input.match(/(.*)-(.*)/);

    // Can never visit the start after departing
    if (to !== START) paths[from] = (paths[from] || new Set()).add(to);
    if (from !== START) paths[to] = (paths[to] || new Set()).add(from);

    return paths;
  }, {});
}

let isSmallCave = (str) => str.toLowerCase() === str;

function countPaths(paths, current, visited, canVisit) {
  if (current === END) return 1; // Found the exit, only one way there

  if (!canVisit(current, visited)) return 0;
  visited[current] = visited[current] + 1;

  return _.sum(Array.from(paths[current]).map(adj => countPaths(paths, adj, { ...visited }, canVisit)));
}

// For part one, can visit large caves or unvisited small caves
let partOneCanVisit = (current, visited) => isSmallCave(current) ? visited[current] === 0 : true;

function partOne(inputs) {
  paths = parsePaths(inputs);
  let visited = Object.keys(paths).reduce((acc, pathStart) => { acc[pathStart] = 0; return acc; }, {});
  return countPaths(paths, START, visited, partOneCanVisit);
}

function partTwoCanVisit(current, visited) {
  if (!isSmallCave(current) || visited[current] === 0) return true; // Can always visit large caves, or unvisited small caves

  // For part two can also visit a small cave twice if no other small cave has been entered twice
  let hasVisitedAnySmallCaveTwice = Object.keys(visited).some(key => isSmallCave(key) && visited[key] > 1);
  return visited[current] < (hasVisitedAnySmallCaveTwice ? 1 : 2);
}

function partTwo(inputs) {
  paths = parsePaths(inputs);
  let visited = Object.keys(paths).reduce((acc, pathStart) => { acc[pathStart] = 0; return acc; }, {});
  return countPaths(paths, START, visited, partTwoCanVisit);
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };