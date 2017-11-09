import BreadthFirstVacuum from './vacuum-world/breadth-first-vacuum';
import DepthFirstVacuum from './vacuum-world/depth-first-vacuum';
import DepthLimitedVacuum from './vacuum-world/depth-limited-vacuum';

import TreeVisualisation from './visualisation/tree-visualisation';

let vacuum;
let treeVis;
let intervalMs = 50;
let iteration = 0;
let vacuumRunning = null;

const updateStateQueueCount = (count) => {
    document.getElementById('queueCount').innerText = count;
}

document.getElementById('initButton').addEventListener('click', () => {
    vacuum = new BreadthFirstVacuum(2, 2);
    vacuum.init();
    updateStateQueueCount(0);
    // Init creates the parent node we need for tree visualisation
    treeVis = new TreeVisualisation(vacuum.root);
    // let vacuum = new DepthFirstVacuum(2, 2);
    // let vacuum = new DepthLimitedVacuum(2, 2);
    // vacuum.run(1);
});

document.getElementById('iterationButton').addEventListener('click', () => {
    iteration += 1;
    // console.log('------------------------------------');
    // console.log('State:');
    // vacuum.currentNode.print();
    vacuum.runIteration();
    updateStateQueueCount(vacuum.stateQueue.length);
    // console.log(`Iteration: ${iteration}`);
    // console.log(vacuum.currentNode);
    // vacuum.currentNode.print();
    treeVis.draw(vacuum.currentNode);
});

document.getElementById('startButton').addEventListener('click', () => {
    vacuumRunning = setInterval(() => {
        iteration += 1;
        vacuum.runIteration();
        treeVis.draw(vacuum.currentNode);
        updateStateQueueCount(vacuum.stateQueue.length);
        if (vacuum.goalReached(vacuum.currentNode.state)) {
            clearInterval(vacuumRunning);
            console.log('Done!');
            treeVis.draw();
            vacuum.currentNode.printPathToRoot();
            treeVis.highlightPathToRoute(vacuum.currentNode.getPathToRoot());
        }
    }, intervalMs);
});

document.getElementById('stopButton').addEventListener('click', () => {
    if (vacuumRunning) {
        clearInterval(vacuumRunning);
        console.log('Stopped');
        treeVis.draw(vacuum.currentNode);
    }
});
