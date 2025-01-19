const _ = require('../../util/utils.js');

/*
the core idea is to turn a string into the paths from letter to letter
each pair of letters is needs to follow one path, i.e. "<A" means: starting from <, press A. e.g. input >>^A

since there are multiple paths in some cases, like "19" being either ^^>> or >>^^, also first find the better of those two
*/

const NUM_KEYPAD_LOCATIONS = {
  '7': [0, 0],
  '8': [1, 0],
  '9': [2, 0],
  '4': [0, 1],
  '5': [1, 1],
  '6': [2, 1],
  '1': [0, 2],
  '2': [1, 2],
  '3': [2, 2],
  '0': [1, 3],
  'A': [2, 3],
};

const DIR_KEYPAD_LOCATIONS = {
  '^': [1, 0],
  'A': [2, 0],
  '<': [0, 1],
  'v': [1, 1],
  '>': [2, 1],
};

const DIRS = [ '^', 'A', '<', 'v', '>' ];

function straightLine(x1, x2, y1, y2) {
  if (x1 > x2) {
    return "<".repeat(x1 - x2);
  } else if (x1 < x2) {
    return ">".repeat(x2 - x1);
  } else if (y1 > y2) {
    return "^".repeat(y1 - y2);
  } else if (y1 < y2) {
    return "v".repeat(y2 - y1);
  }
}

function findAllPaths(map) {
  let paths = {};

  for (let loc1 of Object.keys(map)) {
    let keyPaths = {};

    for (let loc2 of Object.keys(map)) {
      if (loc1 === loc2) {
        keyPaths[loc2] = ['A'];
        continue;
      }

      let [x1, y1] = map[loc1];
      let [x2, y2] = map[loc2];

      let paths = [];
      if (x1 !== x2 && y1 !== y2) {
        let vertical = straightLine(x1, x1, y1, y2);
        let horizontal = straightLine(x1, x2, y1, y1);

        // don't go over the dead space
        let allowedHorizontalFirst = true;
        let allowedVerticalFirst = true;

        if (loc1 === '<') allowedVerticalFirst = false;
        if ((loc1 === '^' || loc1 === 'A') && loc2 === '<') allowedHorizontalFirst = false;

        if ((loc1 === '1' || loc1 === '4' || loc1 === '7') && (loc2 === '0' || loc2 === 'A')) allowedVerticalFirst = false;
        if ((loc1 === '0' || loc1 === 'A') && (loc2 === '1' || loc2 === '4' || loc2 === '7')) allowedHorizontalFirst = false;

        if (allowedHorizontalFirst) paths.push(horizontal + vertical + "A");
        if (allowedVerticalFirst) paths.push(vertical + horizontal + "A");
      } else {
        paths.push(straightLine(x1, x2, y1, y2) + "A");
      }

      keyPaths[loc2] = paths;
    }

    paths[loc1] = keyPaths;
  }

  return paths;
}

// map of loc1 => loc2 => [all possible paths]
const NUM_KEYPAD = findAllPaths(NUM_KEYPAD_LOCATIONS);
const DIR_KEYPAD = findAllPaths(DIR_KEYPAD_LOCATIONS);

let cache = {};
function minDirCost(map, goal) {
  let frontier = [['', 0, goal, 1]];
  let minPath = +Infinity;
  let cache = {};

  while (frontier.length > 0) {
    let [path, idx, target, layer] = frontier.pop();

    let cacheKey = `${target},${layer}`;
    if (cache[cacheKey] < path.length) continue;

    if (idx >= target.length) {
      if (layer === 2) {
        minPath = Math.min(minPath, path.length);
        cache[cacheKey] = path.length;
      } else {
        frontier.push(['', 0, path, layer + 1]);
      }

      continue;
    }

    let curr = target[idx];
    let prev = target[idx - 1] || 'A';

    let options = map[prev][curr];
    for (let option of options) {
      frontier.push([path + option, idx + 1, target, layer]);
    }
  }

  return minPath;
}

// improve directional keypad map to loc1 => loc2 => best path
for (let loc1 of DIRS) {
  for (let loc2 of DIRS) {
  let minCost = +Infinity, minPath;
  let options = DIR_KEYPAD[loc1][loc2];

  for (let option of options) {
    cache = {};
    let cost = minDirCost(DIR_KEYPAD, option);
    if (cost < minCost) {
      minCost = cost;
      minPath = option;
    }
  }

  DIR_KEYPAD[loc1][loc2] = minPath;
  }
}

function findPairs(str) {
  let pairs = {};

  for (let i = 1; i < str.length; i++) {
    let pair = str[i - 1] + str[i];
    pairs[pair] = (pairs[pair] || 0) + 1;
  }

  return pairs;
}

// map of letter pair => path between those two letters
let KEYPAD_COSTS = {};
for (let loc1 of DIRS) {
  for (let loc2 of DIRS) {

    let costs = {};
    let path = 'A' + DIR_KEYPAD[loc1][loc2];

    for (let i = 1; i < path.length; i++) {
      let first = path[i - 1], second = path[i];
      costs[first + second] = (costs[first + second] || 0) + 1;
    }

    KEYPAD_COSTS[loc1 + loc2] = findPairs(path);
  }
}

function minNumpadCost(map, target, numLayers) {
  let paths = [''];

  for (let i = 0; i < target.length; i++) {
    let cur = target[i - 1] || 'A';
    let char = target[i];
    let options = map[cur][char];
    
    if (options.length === 1) {
      paths = paths.map(path => path + options[0]);
    }
    else {
      let poss1 = paths.map(path => path + options[0]);
      let poss2 = paths.map(path => path + options[1]);

      paths = [...poss1, ...poss2];
    }
  }

  let minPath = +Infinity;
  for (let path of paths) {
    let length = minKeypadCost(path, numLayers);
    minPath = Math.min(length, minPath);
  }

  return minPath;
}

// turn a string into a list of the pairs of letters in it
function findPairs(str) {
  let pairs = {};

  for (let i = 1; i < str.length; i++) {
    let pair = str[i - 1] + str[i];
    pairs[pair] = (pairs[pair] || 0) + 1;
  }

  return pairs;
}

function incrementPairs(pairs, firstChar) {
  let newPairs = {};

  let firstPair = 'A' + firstChar;
  for (let nextPair of Object.keys(KEYPAD_COSTS[firstPair])) {
    newPairs[nextPair] = (newPairs[nextPair] || 0) + 1;
  }
  // ignore the starting A press
  newPairs['A' + DIR_KEYPAD['A'][firstChar][0]] = newPairs['A' + DIR_KEYPAD['A'][firstChar][0]] - 1;

  for (let pair of Object.keys(pairs)) {
    for (let nextPair of Object.keys(KEYPAD_COSTS[pair])) {
      newPairs[nextPair] = (newPairs[nextPair] || 0) + pairs[pair];
    }
  }

  return [newPairs, DIR_KEYPAD['A'][firstChar][0]];
}

function sumPairs(pairs) {
  let sum = 0;
  for (let pair of Object.keys(pairs)) {
    sum += pairs[pair];
  }

  return sum;
}

function minKeypadCost(str, numDirRobotLayers) {
  let pairs = findPairs(str), firstChar = str[0];

  for (let i = 0; i < numDirRobotLayers; i++) {
    [pairs, firstChar] = incrementPairs(pairs, firstChar);
  }

  return sumPairs(pairs) + 1; // one extra press for the final "A"
}

function findTotalComplexity(inputs, numLayers) {
  return _.sum(inputs.map(input => {
    let minCost = minNumpadCost(NUM_KEYPAD, input, numLayers);
    return minCost * Number(input.substring(0, 3));
  }));
}

function partOne(inputs, testMode) {
  return findTotalComplexity(inputs, 2);
}

function partTwo(inputs, testMode) {
  return findTotalComplexity(inputs, 25);
}

module.exports = { partOne, partTwo };