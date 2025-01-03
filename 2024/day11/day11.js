const _ = require('../../util/utils.js');

function blink(stone) {
  if (stone === 0) return [1];
  else if (stone.toString().length % 2 === 1) return [stone * 2024];
  else {
    let str = stone.toString();
    let middle = str.length / 2;
    return [Number(str.substring(0, middle)), Number(str.substring(middle))];
  }
}

function partOne(inputs, testMode) {
  let stones = inputs[0].split(' ').map(Number);

  for (let i = 0; i < 25; i++) {
    let newStones = stones.map(blink);
    stones = newStones.flat();
  }

  return stones.length;
}

function blinkAll(stones) {
  let newStones = {};
  for (let n of Object.keys(stones)) {
    let count = stones[n];

    if (n === '0') {
      newStones[1] = (newStones[1] ?? 0) + count;
    } else if (n.length % 2 === 1) {
      let newNum = Number(n) * 2024;
      newStones[newNum] = (newStones[newNum] ?? 0) + count; 
    } else {
      let middle = n.length / 2;
      let num1 = Number(n.substring(0, middle));
      let num2 = Number(n.substring(middle));

      newStones[num1] = (newStones[num1] ?? 0) + count;
      newStones[num2] = (newStones[num2] ?? 0) + count;
    }
  }

  return newStones;
}

function partTwo(inputs, testMode) {
  let stones = {};
  for (let stone of inputs[0].split(' ')) stones[stone] = 1;

  for (let i = 0; i < 75; i++) {
    stones = blinkAll(stones);
  }

  return _.sum(Object.values(stones));
}

module.exports = { partOne, partTwo };