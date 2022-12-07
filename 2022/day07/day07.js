const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function sumOfSmallDirectories(directory, name) {
  let totalSize = 0, smallDirectoriesSum = 0;

  for (let filename of Object.keys(directory)) {
    let file = directory[filename];
    if (typeof(file) === "object") {
      let [subSize, subSmallDirectories] = sumOfSmallDirectories(file, filename);
      totalSize += subSize;
      smallDirectoriesSum += subSmallDirectories;
    }
    else totalSize += file;
  }

  smallDirectoriesSum += (totalSize < 100000 ? totalSize : 0);
  return [totalSize, smallDirectoriesSum];
}

function createDirectory(inputs) {
  let root = {};
  let current = root;
  let pwd = [];

  for (let input of inputs) {
    if (input === "$ ls" || input === "$ cd /")  {
      continue;
    }
    else if (input === "$ cd ..") {
      pwd = pwd.slice(0, pwd.length - 1);
      current = root;
      for (let folder of pwd) current = current[folder];
    }
    else if (input.startsWith("$ cd")) {
      let [_, folderName] = input.match(/\$ cd (.*)/);

      pwd.push(folderName);
      current = current[folderName];
    }
    else if (input.startsWith("dir")) {
      let [_, folderName] = input.match(/dir (.*)/);

      current[folderName] = {};
    } else if (/^\d/.test(input)) {
      let [_, filesize, filename] = input.match(/(\d+) (.*)/);

      current[filename] = Number(filesize);
    }
  }

  return root;
}

function partOne(inputs) {
  let directory = createDirectory(inputs);
  let [totalSize, smallDirectoriesSum] = sumOfSmallDirectories(directory, '/');

  return smallDirectoriesSum;
}

function getSizesByDirectory(directory, name) {
  let size = 0;
  let sizeByDirectory = {};

  for (let filename of Object.keys(directory)) {
    let file = directory[filename];
    if (typeof(file) === "object") {
      let [subSize, subSizeByDirectory] = getSizesByDirectory(file, filename);
      size += subSize;
      Object.assign(sizeByDirectory, subSizeByDirectory);
    }
    else size += file;
  }

  sizeByDirectory[name] = size;
  return [size, sizeByDirectory];
}

const TOTAL_SIZE = 70000000;
const REQUIRED_SIZE = 30000000;

function partTwo(inputs) {
  let directory = createDirectory(inputs);
  let [totalSize, sizeByDirectory] = getSizesByDirectory(directory, '/');

  let unusedSpace = TOTAL_SIZE - totalSize;
  let spaceRequired = REQUIRED_SIZE - unusedSpace;

  let deleteOptions = Object.keys(sizeByDirectory)
    .filter(dir => sizeByDirectory[dir] >= spaceRequired)
    .sort((dirA, dirB) => sizeByDirectory[dirA] - sizeByDirectory[dirB]);

  return sizeByDirectory[deleteOptions[0]];
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };