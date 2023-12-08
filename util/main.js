let fs = require('fs');
const path = require("path");

const YEAR_REGEX = /20\d\d/;
const DAY_REGEX = /day\d\d?/;

let args = process.argv.slice(2);

let year = args[1];
if (!year.match(YEAR_REGEX)) {
  console.log(`Unknown year {${year}}, expected: {${YEAR_REGEX}}`);
  process.exit();
}

let day = args[2];
if (!day.match(DAY_REGEX)) {
  console.log(`Unknown day {${day}}, expected: {${DAY_REGEX}}`);
  process.exit();
}

switch (args[0]) {
  case 'create':
    fs.mkdirSync(`../${year}/${day}`);
    fs.copyFileSync('./template.js', `../${year}/${day}/${day}.js`);
    fs.writeFileSync(`../${year}/${day}/input.txt`, `input.txt`);
    fs.writeFileSync(`../${year}/${day}/input_example.txt`, `input_example.txt`);
    break;
  case 'run':
    let testMode = args.includes(`-t`) || args.includes(`--test`);
    let file = testMode ? `input_example.txt` : `input.txt`;

    // run legacy solutions that export main, before ~2023 day 8
    const { main } = require(`../${year}/${day}/${day}.js`);
    if (main !== undefined) {
      main(file, testMode);
      break;
    }

    const { partOne, partTwo } = require(`../${year}/${day}/${day}.js`);
    let inputs = fs.readFileSync(`../${year}/${day}/${file}`).toString().trim().split(/\r?\n/);

    // run only the part specified, or both by default
    let runPartOne = args.includes('-p1') || !args.includes('-p2');
    let runPartTwo = args.includes('-p2') || !args.includes('-p1');

    if (runPartOne) {
      let partOneStart = performance.now();
      console.log(`Part one answer: ${partOne(inputs, testMode)} (took ${(performance.now() - partOneStart).toFixed(0)}ms)`);
    }

    if (runPartTwo) {
      let partTwoStart = performance.now()
      console.log(`Part two answer: ${partTwo(inputs, testMode)} (took ${(performance.now() - partTwoStart).toFixed(0)}ms)`);
    }

    break;
  default:
    console.log(`Unknown command {${args[0]}}`);
    process.exit();
}
