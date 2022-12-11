const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

class Monkey {
  constructor(monkeyInputs) {
    let [idMatch, id] = monkeyInputs[0].match(/Monkey (\d)/);
    this.id = Number(id);

    let [itemsMatch, items] = monkeyInputs[1].match(/Starting items: (.*)/);
    this.items = items.split(',').map(item => Number(item));

    let [operationMatch, operation] = monkeyInputs[2].match(/Operation: new = (.*)/);
    this.operation = operation;

    let [testMatch, test] = monkeyInputs[3].match(/Test: divisible by (\d+)/);
    this.test = Number(test);

    let [ifTrueMatch, ifTrue] = monkeyInputs[4].match(/If true: throw to monkey (\d)/);
    this.ifTrue = Number(ifTrue);

    let [ifFalseMatch, ifFalse] = monkeyInputs[5].match(/If false: throw to monkey (\d)/);
    this.ifFalse = Number(ifFalse);

    this.numInspections = 0;
  }
}

function monkeyBusiness(inputs, numRounds, handleWorry) {
  let monkeys = inputs.split(/\r?\n\r?\n/)
    .map(monkeyInput => monkeyInput.split(/\r?\n/))
    .map(monkeyInputs => new Monkey(monkeyInputs));

  let leastCommonMultiple = _.product(monkeys.map(monkey => monkey.test));

  for (let round = 0; round < numRounds; round++) {
    for (let monkey of monkeys) {
      for (let item of monkey.items) {
        let operation = monkey.operation.replaceAll("old", item);

        // TODO don't do this in prod
        item = eval(operation);
        item = handleWorry(item, leastCommonMultiple);

        let destination = item % monkey.test === 0 ? monkey.ifTrue : monkey.ifFalse;
        monkeys[destination].items.push(item);

        monkey.numInspections++;
      }

      monkey.items = [];
    }
  }

  let ordered = monkeys.sort((a, b) => b.numInspections - a.numInspections);
  return ordered[0].numInspections * ordered[1].numInspections;
}

let partOneWorry = (item, _) => Math.floor(item / 3);
let partTwoWorry = (item, leastCommonMultiple) => item % leastCommonMultiple;

let partOne = (inputs) => monkeyBusiness(inputs, 20, partOneWorry);
let partTwo = (inputs) => monkeyBusiness(inputs, 10000, partTwoWorry);

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim();

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };