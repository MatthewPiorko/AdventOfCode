const fs = require("fs");
const path = require("path");

const YEAR_REGEX = /20\d\d/;
const DAY_REGEX = /day\d\d?/;

async function main() {
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
      if (!fs.existsSync(`../${year}/${day}`)) fs.mkdirSync(`../${year}/${day}`);
      if (!fs.existsSync(`../${year}/${day}/${day}.js`)) fs.copyFileSync('./template.js', `../${year}/${day}/${day}.js`);
      if (!fs.existsSync(`../${year}/${day}/input_example.txt`)) fs.writeFileSync(`../${year}/${day}/input_example.txt`, `input_example.txt`);
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

      let inputs = await retrieveInputs(year, day, file);
      const { partOne, partTwo } = require(`../${year}/${day}/${day}.js`);

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
}

async function retrieveInputs(year, day, file) {
  let inputFile = `../${year}/${day}/${file}`;
  let inputs = fs.existsSync(inputFile) ? fs.readFileSync(inputFile).toString() : undefined;
  let dayNumber = Number(day.substring(3));

  // fetch the input if it's not already provided
  // AOC session cookie must be provided in the environment variables
  if (!inputs && process.env.AOC_SESSION !== undefined && Date.now() > Date.parse(`${year}-12-${dayNumber} GMT-5`)) {
    console.log(`Input not provided, fetching it instead`);

    let response = await fetch(`https://adventofcode.com/${year}/day/${dayNumber}/input`, {
      headers: {
        Cookie: `session=${process.env.AOC_SESSION}`
      }});
    inputs = await response.text();

    if (!response.ok) {
      console.log(`Unable to fetch inputs due to {${response.status} ${response.statusText}}:`);
      console.log(inputs);
      process.exit();
    }

    // cache it so it isn't re-queried later
    fs.writeFileSync(`../${year}/${day}/${file}`, inputs);
  } else if (!inputs) {
    console.log(`No input.txt file provided`);
    process.exit();
  }

  return inputs.trim().split(/\r?\n/);
}

main();