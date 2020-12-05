let fs = require('fs');

let args = process.argv.slice(2);

switch (args[0]) {
  case 'create':
    let filename = args[1];
    fs.mkdirSync(`../${filename}`);
    fs.copyFileSync('template.js', `../${filename}/${filename}.js`);
    fs.writeFileSync(`../${filename}/input.txt`, `input.txt`);
    break;
}
