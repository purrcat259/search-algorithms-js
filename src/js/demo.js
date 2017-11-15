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
};

const drawResultantPath = (route) => {
    for (let i = 0; i < route.length; i++) {
        let node = route[i];
        let nodeEl = document.createElement('span');
        nodeEl.innerText = `[${i}] ${node.action} `;
        document.getElementById('pathResult').appendChild(nodeEl);
    }
};

document.getElementById('initButton').addEventListener('click', () => {
    vacuum = new BreadthFirstVacuum(2, 2);
    vacuum.init();
    updateStateQueueCount(0);
    // Init creates the parent node we need for tree visualisation
    treeVis = new TreeVisualisation(vacuum.root);
    treeVis.drawIterative(vacuum.root);
});

document.getElementById('iterationButton').addEventListener('click', () => {
    iteration += 1;
    vacuum.runIteration();
    updateStateQueueCount(vacuum.stateQueue.length);
    treeVis.drawIterative(vacuum.currentNode);
});

document.getElementById('startButton').addEventListener('click', () => {
    vacuumRunning = setInterval(() => {
        iteration += 1;
        vacuum.runIteration();
        treeVis.drawIterative(vacuum.currentNode);
        updateStateQueueCount(vacuum.stateQueue.length);
        if (vacuum.goalReached(vacuum.currentNode.state)) {
            clearInterval(vacuumRunning);
            console.log('Done!');
            treeVis.draw();
            vacuum.currentNode.printPathToRoot();
            treeVis.highlightPathToRoute(vacuum.currentNode.getPathToRoot());
            drawResultantPath(vacuum.currentNode.getPathToRoot());
        }
    }, intervalMs);
});

document.getElementById('stopButton').addEventListener('click', () => {
    if (vacuumRunning) {
        clearInterval(vacuumRunning);
        console.log('Stopped');
        treeVis.drawIterative();
    }
});
