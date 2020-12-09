let fs = require('fs');

const YEAR_REGEX = /20\d\d/;
const DAY_REGEX = /day\d\d?/;

let args = process.argv.slice(2);

let year = args[1];
if (!year.match(/20\d\d/)) {
  console.log(`Unknown year {${year}}, expected: {${YEAR_REGEX}}`);
  process.exit();
}

let day = args[2];
if (!day.match(/day\d\d?/)) {
  console.log(`Unknown day {${day}}, expected: {${DAY_REGEX}}`);
  process.exit();
}

switch (args[0]) {
  case 'create':
    fs.mkdirSync(`../${year}/${day}`);
    fs.copyFileSync('./template.js', `../${year}/${day}/${day}.js`);
    fs.writeFileSync(`../${year}/${day}/input.txt`, `input.txt`);
    break;
  case 'run':
    const { main } = require(`../${year}/${day}/${day}.js`);
    main();
    break;
  default:
    console.log(`Unknown command {${args[0]}}`);
    process.exit();
}
