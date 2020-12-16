const fs = require("fs");
const path = require("path");

function parseInput(input) {
  let myTicketIndex = input.findIndex(str => str.startsWith("your ticket:"));
  let otherTicketsIndex = input.findIndex(str => str.startsWith("nearby tickets:"));

  let ruleStrings = input.slice(0, myTicketIndex - 1);
  let myTicket = input.slice(myTicketIndex + 1, myTicketIndex + 2)[0].split(',').map(Number);
  let otherTickets = input.slice(otherTicketsIndex + 1);

  let rules = [];
  let ruleDescriptions = [];

  for (rule of ruleStrings) {
    let [_, description, range1Start, range1End, range2Start, range2End] = rule.match(/(.*): (\d+)-(\d+) or (\d+)-(\d+)/);
    range1Start = Number(range1Start);
    range1End = Number(range1End);
    range2Start = Number(range2Start);
    range2End = Number(range2End);

    ruleDescriptions.push(description);

    rules.push([[range1Start, range1End], [range2Start, range2End]]);
  }

  return [rules, ruleDescriptions, myTicket, otherTickets];
}

function valueInRuleRange(val, rule) {
  return (val >= rule[0][0] && val <= rule[0][1]) || (val >= rule[1][0] && val <= rule[1][1]);
}

function partOne(rules, otherTickets) {
  let invalidSum = 0;

  for (ticket of otherTickets) {
    for (entry of ticket.split(',')) {
      let val = Number(entry);

      if (!rules.some(rule => valueInRuleRange(val, rule))) {
        invalidSum += val;
      }
    }
  }

  return invalidSum;
}

function partTwo(rules, ruleDescriptions, myTicket, otherTickets) {
  // Find any tickets that have all entries which fit at least one rule
  let validTickets = [];
  for (ticket of otherTickets) {
    if (ticket.split(',').every(entry => {
      return rules.some(rule => valueInRuleRange(Number(entry), rule))
    })) {
      validTickets.push(ticket);
    }
  }

  // Find the list of potential rules for each position
  let potentialRules = [];
  for (let i = 0; i < rules.length; i++) {
    for (let ruleIdx = 0; ruleIdx < rules.length; ruleIdx++) {
      if (validTickets.every(ticket => {
        let ticketVals = ticket.split(',').map(Number);
        let val = Number(ticketVals[i]);

        return valueInRuleRange(val, rules[ruleIdx]);
      })) {
        potentialRules[i] = [...(potentialRules[i] || []), ruleIdx];
      }
    }
  }

  // Find any rules which are valid for only one position.
  // Once found, set that rule to the given position, and remove the rule from all other positions.
  // Repeat for every rule, so that each rule will have a unique position.
  let ruleOrder = new Array(rules.length);
  for (let i = 0; i < rules.length; i++) {
    for (let ruleIdx = 0; ruleIdx < potentialRules.length; ruleIdx++) {
      if (potentialRules[ruleIdx].length == 1) {
        let idx = potentialRules[ruleIdx][0];
        ruleOrder[ruleIdx] = idx;
        potentialRules = potentialRules.map(potentialRule => potentialRule.filter(val => val != idx));
      }
    }
  }

  let resultValues = [];
  for (let i = 0; i < ruleDescriptions.length; i++) {
    let str = ruleDescriptions[i];
    if (str.startsWith('departure')) {
      resultValues.push(myTicket[ruleOrder.findIndex(idx => idx == i)]);
    }
  }

  return resultValues.reduce((acc, val) => acc * val, 1);
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);
  let [rules, ruleDescriptions, myTicket, otherTickets] = parseInput(input);

  console.log(`Part one answer: ${partOne(rules, otherTickets)}`);
  console.log(`Part two answer: ${partTwo(rules, ruleDescriptions, myTicket, otherTickets)}`);
}

module.exports = { main };