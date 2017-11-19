import BreadthFirstVacuum from './vacuum-world/breadth-first-vacuum';
import DepthFirstVacuum from './vacuum-world/depth-first-vacuum';
import DepthLimitedVacuum from './vacuum-world/depth-limited-vacuum';

import TreeVisualisation from './visualisation/tree-visualisation';

let vacuum;
let treeVis;
let rows = 2;  // TODO: Add inputs to change these numbers
let columns = 2;
let intervalMs = 50;
let iteration = 0;
let vacuumRunning = null;

const updateStateQueueCount = (count) => {
    document.getElementById('queueCount').innerText = count;
};

const drawResultantPath = (route) => {
    // Clear any old paths
    document.getElementById('pathResult').innerHTML = '';
    if (!route) {
        let nodeEl = document.createElement('span');
        nodeEl.innerText = 'NO PATH FOUND';
        document.getElementById('pathResult').appendChild(nodeEl);
    } else {
        for (let i = 0; i < route.length; i++) {
            let node = route[i];
            let nodeEl = document.createElement('span');
            nodeEl.innerText = `[${i}] ${node.action} `;
            document.getElementById('pathResult').appendChild(nodeEl);
        }
    }
};

const initialiseVacuumWorld = () => {
    let searchSelect = document.getElementById('searchSelect');
    let chosenType = searchSelect.options[searchSelect.selectedIndex].value;
    switch (chosenType) {
        case 'bfs':
            vacuum = new BreadthFirstVacuum(rows, columns);
            break;
        case 'dfs':
            vacuum = new DepthFirstVacuum(rows, columns);
            break;
        case 'dls':
            vacuum = new DepthLimitedVacuum(rows, columns);
            break;
    }
};

document.getElementById('initButton').addEventListener('click', () => {
    initialiseVacuumWorld();
    vacuum.init();
    // updateStateQueueCount(0); // TODO: Generalise
    // Init creates the parent node we need for tree visualisation
    treeVis = new TreeVisualisation(vacuum.root);
    treeVis.drawIterative(vacuum.root);
});

document.getElementById('iterationButton').addEventListener('click', () => {
    iteration += 1;
    vacuum.runIteration();
    // updateStateQueueCount(vacuum.stateQueue.length); // TODO: Generalise
    treeVis.drawIterative(vacuum.currentNode);
});

document.getElementById('startButton').addEventListener('click', () => {
    vacuumRunning = setInterval(() => {
        if (!vacuum.canContinue()) {
            clearInterval(vacuumRunning);
            treeVis.draw();
            if (vacuum.goalReached()) {
                console.log('Search Complete!');
                treeVis.highlightPathToRoute(vacuum.currentNode.getPathToRoot());
                drawResultantPath(vacuum.currentNode.getPathToRoot());
            } else if (vacuum.noPathFound()) {
                console.log('No path found');
                drawResultantPath(null);
                treeVis.showNoPathFound();
            }
        }
        iteration += 1;
        vacuum.runIteration();
        treeVis.drawIterative(vacuum.currentNode);
        // updateStateQueueCount(vacuum.stateQueue.length); // TODO: Generalise
    }, intervalMs);
});

document.getElementById('stopButton').addEventListener('click', () => {
    if (vacuumRunning) {
        clearInterval(vacuumRunning);
        console.log('Stopped');
        treeVis.drawIterative();
    }
});
