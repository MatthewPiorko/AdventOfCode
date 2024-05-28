const _ = require('../../util/utils.js');

const OBJECTS = {
  OPERATIONAL: ".",
  DAMAGED: "#",
  UNKNOWN: "?"
};

function partOne(inputs, testMode) {
  return _.sum(inputs.map(input => calculatePossibilities(input)));
}

function calculatePossibilities(row) {
  let [arrangement, groups] = row.split(" ");
  arrangement = arrangement.split("");
  groups = groups.split(",").map(Number);

  let numUnknown = arrangement.filter(o => o === OBJECTS.UNKNOWN).length;
  let perms = permutations(numUnknown);

  let numPossibilities = 0;
  for (let i = 0; i < perms.length; i++) {
    let replaced = replaceUnknown([...arrangement], perms[i]);
    if (isValid(replaced, groups)) {
      // console.log(`${replaced.join("")} is valid`);
      numPossibilities++;
    }
  }

  // console.log(numPossibilities);
  return numPossibilities;
}

const PERMUTATIONS_CACHE = {};

function permutations(length) {
  if (PERMUTATIONS_CACHE[length]) return PERMUTATIONS_CACHE[length];

  if (length === 0) return [];
  if (length === 1) return [[false], [true]];

  let perms = [];
  let subPerms1 = permutations(length - 1);
  for (let i = 0; i < subPerms1.length; i++) {
    perms.push([false, ...subPerms1[i]]);
    perms.push([true, ...subPerms1[i]]);
  }

  PERMUTATIONS_CACHE[length] = perms;

  return perms;
}

function replaceUnknown(arrangement, seed) {
  let idx = 0;

  for (let i = 0; i < arrangement.length; i++) {
    if (arrangement[i] === OBJECTS.UNKNOWN) {
      arrangement[i] = seed[idx] ? OBJECTS.DAMAGED : OBJECTS.OPERATIONAL;
      idx++;
    }
  }

  return arrangement;
}

function isValid(arrangement, groups) {
  arrangement.push(OBJECTS.OPERATIONAL);
  let idx = 0, currentGroup = 0, isInGroup = false;

  for (let i = 0; i < arrangement.length; i++) {
    if (arrangement[i] === OBJECTS.DAMAGED) {
      isInGroup = true;
      currentGroup++;
    }

    if (arrangement[i] === OBJECTS.OPERATIONAL && isInGroup) {
      if (currentGroup !== groups[idx]) return false;
      idx++;
      currentGroup = 0;
      isInGroup = false;
    }
  }

  return idx === groups.length;
}

function partTwo(inputs, testMode) {
  return _.sum(inputs.map(input => {
    let [arrangement, groups] = input.split(" ");
    console.log('==========');
    let initial = calculatePossibilities(input);

    // test if it tessalates well
    // let double = calculatePossibilities(`${arrangement}?${arrangement} ${groups},${groups}`);
    // if (initial === double) return initial;

    
    let poss1 = calculatePossibilities(`?${arrangement} ${groups}`);
    let poss2 = calculatePossibilities(`${arrangement}? ${groups}`);

    console.log(`Subsequent had ${poss1} or ${poss2}, resulting in ${(Math.max(poss1, poss2)**4) * initial}`);
    return Math.max(poss1, poss2)**4 * initial;
  }));
}

module.exports = { partOne, partTwo };