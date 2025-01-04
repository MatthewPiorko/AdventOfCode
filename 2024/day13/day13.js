const _ = require('../../util/utils.js');

function isSolvable(machine, offset, maximum) {
  let [matchA, ax, ay] = machine[0].match(/Button A: X\+(\d+), Y\+(\d+)/);
  let [matchB, bx, by] = machine[1].match(/Button B: X\+(\d+), Y\+(\d+)/);
  let [matchT, tx, ty] = machine[2].match(/Prize: X=(\d+), Y=(\d+)/);

  tx = Number(tx) + offset, ty = Number(ty) + offset;

  // make the equations ax + bx = tx, ay + by = ty
  // multiply the first by "by", the second by bx, then subtract aby from both
  let ax2 = ax * by, tx2 = tx * by;
  let ay2 = ay * bx, ty2 = ty * bx;

  // ax2 = tx2, ay2 = tx2, so isolate "a"
  let a = Math.abs(tx2 - ty2) / Math.abs(ax2 - ay2);
  let b = (tx - (ax * a)) / bx;

  if (a > maximum || b > maximum) return 0;
  if (a !== Math.floor(a) || b !== Math.floor(b)) return 0;

  return (a * 3) + b;
}

function partOne(inputs, testMode) {
  let machines = inputs.join('\n').split('\n\n').map(machine => machine.split('\n'));
  return _.sum(machines.map(machine => isSolvable(machine, 0, 100)));
}

function partTwo(inputs, testMode) {
  let machines = inputs.join('\n').split('\n\n').map(machine => machine.split('\n'));
  return _.sum(machines.map(machine => isSolvable(machine, 10000000000000, undefined)));
}

module.exports = { partOne, partTwo };