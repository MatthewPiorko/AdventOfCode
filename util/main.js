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
      let filePath = `../${year}/${day}/${file}`;
      if (!fs.existsSync(filePath)) await populateInput(year, day, filePath);

      // run legacy solutions that export main, before ~2023 day 8
      const { main } = require(`../${year}/${day}/${day}.js`);
      if (main !== undefined) {
        main(file, testMode);
        break;
      }

      const { partOne, partTwo } = require(`../${year}/${day}/${day}.js`);
      let inputs = fs.readFileSync(filePath).toString().trim().split(/\r?\n/);

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

async function populateInput(year, day, file) {
  console.log(`Input not provided, fetching it instead`);
  let dayNumber = Number(day.substring(3)); //to handle "01" parsing to "1"

  if (!process.env.AOC_SESSION) {
    console.log(`No AOC session token was found in environment variables`);
    process.exit();
  }
  if (Date.now() < Date.parse(`${year}-12-${dayNumber} GMT-5`)) {
    console.log(`AOC input is not available until midnight EST`);
    process.exit();
  }

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
  fs.writeFileSync(file, inputs);
}

main();