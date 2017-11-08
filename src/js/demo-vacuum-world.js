import BreadthFirstVacuum from './vacuum-world/breadth-first-vacuum';
import DepthFirstVacuum from './vacuum-world/depth-first-vacuum';
import DepthLimitedVacuum from './vacuum-world/depth-limited-vacuum';

import TreeVisualisation from './visualisation/tree-visualisation';

let vacuum;
let treeVis;
let iteration = 0;

document.getElementById('initButton').addEventListener('click', () => {
    vacuum = new BreadthFirstVacuum(2, 2);
    vacuum.init();
    // Init creates the parent node we need for tree visualisation
    treeVis = new TreeVisualisation(vacuum.root);
    // let vacuum = new DepthFirstVacuum(2, 2);
    // let vacuum = new DepthLimitedVacuum(2, 2);
    // vacuum.run(1);
});

document.getElementById('iterationButton').addEventListener('click', () => {
    iteration += 1;
    console.log('------------------------------------');
    console.log('State:');
    vacuum.currentNode.print();
    console.log(`Iteration: ${iteration}`);
    vacuum.runIteration();
    console.log(vacuum.currentNode);
    vacuum.currentNode.print();
});
