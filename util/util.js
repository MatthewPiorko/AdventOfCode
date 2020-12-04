let fs = require('fs');

let args = process.argv.slice(2);

switch (args[0]) {
  case 'create':
    let filename = args[1];
    fs.mkdir(`../${filename}`, (err) => { throw err });
    fs.writeFile(`../${filename}/${filename}.js`, `${filename}.js`, (err) => { throw err });
    fs.writeFile(`../${filename}/input.txt`, `input.txt`, (err) => { throw err });
    break;
}
