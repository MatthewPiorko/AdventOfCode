const _ = require('../../util/utils.js');

function partOne(inputs, testMode) {
  let dial = 50;
  let timesOnZero = 0;

  for (let input of inputs) {
    let [match, dir, val] = input.match(/(\w)(\d+)/);
    val = Number(val);

    dial = _.safeMod(dial + val * (dir === 'R' ? 1 : -1), 100);

    if (dial === 0) timesOnZero++;
  }

  return timesOnZero;
}

function partTwo(inputs, testMode) {
  let dial = 50;
  let timesOnZero = 0;

  for (let input of inputs) {
    let [match, dir, val] = input.match(/(\w)(\d+)/);
    val = Number(val);

    // each turn of 100 is effectively a no-op
    if (val > 100) {
      timesOnZero += Math.floor(val / 100);
      val = val % 100;
    }

    // if you're starting on 0 and turning left, you aren't actually hitting 0 a new time since you started on 0
    if (dial === 0 && dir === 'L') timesOnZero--;

    val = val * (dir === 'R' ? 1 : -1);

    // if the dial passes 0 on this turn
    if (dial + val >= 100 || dial + val < 0) timesOnZero++;

    dial = _.safeMod(dial + val, 100);

    // if you're ending on 0 and came from turning left, count it
    // if you're ending on 0 and came from turning right, you already passed 100 and counted it above
    if (dial === 0 && dir === 'L') timesOnZero++;
  }

  return timesOnZero;
}

module.exports = { partOne, partTwo };