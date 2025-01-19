const _ = require('../../util/utils.js');

function generateGraph(inputs) {
  let graph = {};

  for (let input of inputs) {
    let [, c1, c2] = input.match(/(\w+)-(\w+)/);

    if (!graph[c1]) graph[c1] = new Set();
    if (!graph[c2]) graph[c2] = new Set();

    graph[c1].add(c2);
    graph[c2].add(c1);
  }

  return [graph, Object.keys(graph)];
}

function partOne(inputs, testMode) {
  let [graph, nodes] = generateGraph(inputs);

  let numConnections = 0;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      for (let k = j + 1; k < nodes.length; k++) {
        let c1 = nodes[i], c2 = nodes[j], c3 = nodes[k];

        if (!c1.startsWith("t") && !c2.startsWith("t") && !c3.startsWith("t")) continue;
        if (!graph[c1].has(c2) || !graph[c1].has(c3) || !graph[c2].has(c3)) continue;

        numConnections++;
      }
    }
  }

  return numConnections;
}

function findLargerSubgroups(graph, nodes, knownSubgroups) {
  let subGroups = [];

  for (let subGroup of knownSubgroups) {
    for (let node of nodes) {
      // skip if node is already in subGroup
      if (subGroup.filter(n => n === node).length > 0) continue;

      // skip if node isn't connected to anything in the group
      if (subGroup.filter(n => !graph[n].has(node)).length > 0) continue;

      subGroups.push([...subGroup, node]);
    }
  }

  subGroups = new Set(subGroups.map(group => group.sort().join(',')));
  return Array.from(subGroups).map(x => x.split(','));
}

function partTwo(inputs, testMode) {
  let [graph, nodes] = generateGraph(inputs);

  let subGroups = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      for (let k = j + 1; k < nodes.length; k++) {
        let c1 = nodes[i], c2 = nodes[j], c3 = nodes[k];

        if (!graph[c1].has(c2) || !graph[c1].has(c3) || !graph[c2].has(c3)) continue;

        subGroups.push([c1, c2, c3]);
      }
    }
  }

  while (true) {
    let largerGroups = findLargerSubgroups(graph, nodes, subGroups);
    if (largerGroups.length === 0) return subGroups[0];
    else subGroups = largerGroups;
  }

  return;
}

module.exports = { partOne, partTwo };