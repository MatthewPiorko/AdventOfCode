const fs = require("fs");
const path = require("path");

function createOrbitMap(orbits) {
  return orbits.reduce((map, orbit) => {
    let [_, parent, child] = orbit.match(/(.+)\)(.+)/);
    map[child] = parent;
    return map;
  }, {});
}

function findDepth(map, obj, cache, acc) {
  if (obj == "COM") return 0;
  if (cache[obj] != undefined) return cache[obj];

  let depth = 1 + findDepth(map, map[obj], cache);
  cache[obj] = depth;

  return depth;
}

function findTotalDepth(orbitsMap) {
  let cache = {};
  return Object.keys(orbitsMap).map(obj => findDepth(orbitsMap, obj, cache))
    .reduce((acc, val) => acc + val, 0);
}

function search(map, start, end) {
  let distancesFromStart = {};
  let current = start, distance = 0;

  while (current != "COM") {
    distancesFromStart[current] = distance;
    distance++;
    current = map[current];
  }

  current = end, distance = 0;

  while (current != "COM") {
    if (distancesFromStart[current] != undefined) return distancesFromStart[current] + distance;

    distance++;
    current = map[current];
  }

  return Infinity;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);
  let orbitsMap = createOrbitMap(input);

  console.log(`Part one answer: ${findTotalDepth(orbitsMap)}`);
  // Subtract two to not include the "YOU" and "SAN" orbits
  console.log(`Part two answer: ${search(orbitsMap, "YOU", "SAN") - 2}`);
}

module.exports = { main };