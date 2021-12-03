let fs = require('fs');

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
    let file = args[3] === `-t` || args[3] === `--test` ? `input_example.txt` : `input.txt`;
    const { main } = require(`../${year}/${day}/${day}.js`);
    main(file);
    break;
  default:
    console.log(`Unknown command {${args[0]}}`);
    process.exit();
}
