const fs = require("fs");
const path = require("path");

const STATE = {
  AWAKE: '.',
  ASLEEP: '#'
};

class Log {
  constructor(year, month, day, hour, minute, text) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.hour = hour;
    this.minute = minute;
    this.text = text;

    let date = new Date();
    date.setYear(year);
    date.setMonth(month - 1);
    date.setDate(day);
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(1);

    this.date = date;
  }
}

function parseInput(input) {
  let parsed = [];

  for (let line of input) {
    let [, year, month, day, hour, minute, text] = line.match(/\[(\d+)-(\d+)-(\d+) (\d+):(\d+)\] (.*)/);

    parsed.push(new Log(Number(year), Number(month), Number(day), Number(hour), Number(minute), text));
  }

  parsed = parsed.sort((log1, log2) => log1.date.getTime() - log2.date.getTime());

  return parsed;
}

function calculateRotationAndTimetable(logs) {
  let timetable = [];
  let guardRotation = [];

  let currentDay;
  let currentMinute;
  let currentGuard;

  for (let log of logs) {
    if (log.text.startsWith("Guard")) {
      timetable.push(currentDay);
      let [, guardId] = log.text.match(/Guard #(\d+) begins shift/);
      guardRotation.push(Number(guardId));

      currentDay = new Array(60).fill(STATE.AWAKE);
      currentMinute = 0;
      currentGuard = guardId;
    } else if (log.text.startsWith("falls asleep")) {
      currentMinute = log.minute;
    } else if (log.text.startsWith("wakes up")) {
      for (let m = currentMinute; m < log.minute; m++) {
        currentDay[m] = STATE.ASLEEP;
      }
    } else {
      console.log(`Got undefined log text: {${log.text}}`);
      return undefined;
    }
  }

  timetable.push(currentDay);
  timetable.shift(); // Remove first bogus entry

  return [timetable, guardRotation]
}

function partOne(input) {
  let logs = parseInput(input);
  let [timetable, guardRotation] = calculateRotationAndTimetable(logs);

  let numAsleepByGuard = {};
  for (let i = 0; i < timetable.length; i++) {
    let guardId = guardRotation[i];
    let entry = timetable[i];
    let numAsleep = 0;

    for (let action of entry) {
      if (action === STATE.ASLEEP) numAsleep++;
    }

    numAsleepByGuard[guardId] = (numAsleepByGuard[guardId] || 0) + numAsleep;
  }

  let chosenGuard = guardRotation[0];
  for (let guardId of Object.keys(numAsleepByGuard)) {
    if (numAsleepByGuard[guardId] > numAsleepByGuard[chosenGuard]) chosenGuard = guardId;
  }

  let numAsleepByMinute = new Array(60).fill(0);
  for (let i = 0; i < timetable.length; i++) {
    let guardId = guardRotation[i];

    if (guardId != chosenGuard) continue;

    for (let minute = 0; minute < 60; minute++) {
      if (timetable[i][minute] === STATE.ASLEEP) numAsleepByMinute[minute]++;
    }
  }

  let chosenMinute = 0;
  for (let i = 0; i < 60; i++) {
    if (numAsleepByMinute[i] > numAsleepByMinute[chosenMinute]) chosenMinute = i;
  }

  return chosenGuard * chosenMinute;
}

function partTwo(input) {
  let logs = parseInput(input);
  let [timetable, guardRotation] = calculateRotationAndTimetable(logs);

  let numAsleepByGuard = {};
  for (let i = 0; i < timetable.length; i++) {
    let guardId = guardRotation[i];
    if (numAsleepByGuard[guardId] === undefined) numAsleepByGuard[guardId] = new Array(60).fill(0);

    for (let minute = 0; minute < 60; minute++) {
      if (timetable[i][minute] === STATE.ASLEEP) numAsleepByGuard[guardId][minute]++;
    }
  }

  let bestGuard = undefined, bestCount = -Infinity, bestMinute = undefined;
  for (let guardId of Object.keys(numAsleepByGuard)) {
    for (let minute = 0; minute < 60; minute++) {
      if (numAsleepByGuard[guardId][minute] > bestCount) {
        bestCount = numAsleepByGuard[guardId][minute];
        bestGuard = guardId;
        bestMinute = minute;
      }
    }
  }

  return bestGuard * bestMinute;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(input)}`);
  console.log(`Part two answer: ${partTwo(input)}`);
}

module.exports = { main };