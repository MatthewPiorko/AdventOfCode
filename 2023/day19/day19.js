const _ = require('../../util/utils.js');

class Part {
  constructor(x, m, a, s) {
    this.x = Number(x);
    this.m = Number(m);
    this.a = Number(a);
    this.s = Number(s);
  }
}

function followWorkflow(part, workflows) {
  let current = "in";

  while (true) {
    if (current === "A") return true;
    if (current === "R") return false;

    let workflow = workflows[current];
    for (let piece of workflow) {
      if (piece.length === 1) {
        current = piece[0];
        break;
      }

      let [system, operator, param, onMatch] = piece;
      if (operator === ">" && part[system] > param) {
        current = onMatch;
        break;
      } else if (operator === "<" && part[system] < param) {
        current = onMatch;
        break;
      }
    }
  }
}

function partOne(inputs, testMode) {
  let [workflowsInput, partsInput] = inputs.join('\n').split('\n\n');

  let parts = partsInput.split('\n').map(part => {
    let [,x,m,a,s] = part.match(/{x=(\d+),m=(\d+),a=(\d+),s=(\d+)}/);
    return new Part(x, m, a, s);
  });

  let workflows = {};
  for (let workflow of workflowsInput.split('\n')) {
    let [, name, commands] = workflow.match(/(\w+){(.*)}/);
    commands = commands.split(',').map(command => {
      if (!command.includes(":")) return [command];

      let [, system, operator, param, onMatch] = command.match(/(\w+)(.)(\d+):(\w+)/);
      return [system, operator, Number(param), onMatch];
    });

    workflows[name] = commands;
  }

  return _.sum(
    parts.filter(part => followWorkflow(part, workflows))
         .map(part => part.x + part.m + part.a + part.s));
}

function findSignificantValues(workflows, desiredSystem) {
  let significant = [0, 4000];

  for (let workflow of Object.keys(workflows)) {
    for (let piece of workflows[workflow]) {
      if (piece.length === 1) continue;

      let [system, operator, param, onMatch] = piece;
      if (system !== desiredSystem) continue;

      if (operator === ">") significant.push(param);
      if (operator === "<") significant.push(param - 1);
    }
  }
  return significant.sort((a,b) => a - b);
}

function partTwo(inputs, testMode) {
  let [workflowsInput, partsInput] = inputs.join('\n').split('\n\n');

  let workflows = {};
  for (let workflow of workflowsInput.split('\n')) {
    let [, name, commands] = workflow.match(/(\w+){(.*)}/);
    commands = commands.split(',').map(command => {
      if (!command.includes(":")) return [command];

      let [, system, operator, param, onMatch] = command.match(/(\w+)(.)(\d+):(\w+)/);
      return [system, operator, Number(param), onMatch];
    });

    workflows[name] = commands;
  }

  let significantX = findSignificantValues(workflows, "x");
  let significantM = findSignificantValues(workflows, "m");
  let significantA = findSignificantValues(workflows, "a");
  let significantS = findSignificantValues(workflows, "s");

  let numAccepted = 0;
  for (let xi = 0; xi < significantX.length - 1; xi++) {
    let x = significantX[xi];
    for (let mi = 0; mi < significantM.length - 1; mi++) {
      let m = significantM[mi];
      for (let ai = 0; ai < significantA.length - 1; ai++) {
        let a = significantA[ai];
        for (let si = 0; si < significantS.length - 1; si++) {
          let s = significantS[si];

          // assume that all parts between these ranges behave the same as this example part
          let examplePart = new Part(x + 1, m + 1, a + 1, s + 1); 

          if (!followWorkflow(examplePart, workflows)) continue;

          let xl = significantX[xi + 1] - x, ml = significantM[mi + 1] - m, al = significantA[ai + 1] - a, sl = significantS[si + 1] - s;
          numAccepted += xl * ml * al * sl;
        }
      }
    }
  }

  return numAccepted;
}

module.exports = { partOne, partTwo };