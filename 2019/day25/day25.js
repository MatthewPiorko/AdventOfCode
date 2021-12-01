const fs = require("fs");
const path = require("path");
const readline = require('readline');
const util = require('util');

const { runInstructionsAsync } = require("../common/intcode-compiler");

let ITEMS = ["shell", "klein bottle", "tambourine", "weather machine", "antenna",
  "spool of cat6", "mug", "cake"];

// Generate a list of instructions to drop all items, and take only what is in the bit mask
function setInventory(num) {
  let input = ITEMS.map(i => `drop ${i}`);

  let str = num.toString(2).padStart(ITEMS.length, 0);

  console.log(str);

  for (i = 0; i < ITEMS.length; i++) {
    if (str[i] === "1") input.push(`take ${ITEMS[i]}`);
  }

  // Go to security room to check answer
  input.push("east");

  return input;
}

async function partOne(instrs) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = util.promisify(rl.question).bind(rl);

  let stdout = "";
  let handleOutput = (intChar) => {
    if (intChar === 10) {
      console.log(stdout);
      stdout = "";
    } else {
      stdout += String.fromCharCode(intChar);
    }
  }

  // Instructions to pick up every item on the map
  let stdin = [
    "east",
    "take antenna",
    "west",
    "north",
    "take weather machine",
    "north",
    "take klein bottle",
    "east",
    "take spool of cat6",
    "east",
    "south",
    "take mug",
    "north",
    "north",
    "east",
    "north",
    "north",
    "take tambourine",
    "south",
    "south",
    "south",
    "take shell",
    "north",
    "west",
    "west",
    "north",
    "take cake",
    "south",
    "east",
    "south",
    "west",
    "south",
    "south",
    "east"
  ];

  let breakInAttempt = 0; // Binary mask of which items to keep

  stdin = stdin.map(line => line + '\n').join('').split('');

  let getInput = async () => {
    if (breakInAttempt > 255) {
      await question('Attempted all combinations and could not break in');
    }
    if (stdin.length == 0) {
      let nextCommands = setInventory(breakInAttempt);
      nextCommands = nextCommands.map(line => line + '\n').join('').split('');
      breakInAttempt++;

      stdin = nextCommands;

      // Manual exploration of map
      /*let input = await question('Command: ');
      input = (input + '\n').split('');

      stdin = input;*/
    }

    return stdin.shift().charCodeAt(0);
  }

  await runInstructionsAsync(instrs, getInput, handleOutput);

  rl.close();

  return;
}

async function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);
  let instrs = input[0].trim().split(',').map(String);

  partOne(instrs);
}

module.exports = { main };