import './demo.scss';

import BreadthFirstVacuum from './vacuum-world/breadth-first-vacuum';
import DepthFirstVacuum from './vacuum-world/depth-first-vacuum';
import DepthLimitedVacuum from './vacuum-world/depth-limited-vacuum';
import IterativeDepthLimitedVacuum from './vacuum-world/iterative-depth-limited-vacuum';

import TreeVisualisation from './visualisation/tree-visualisation';

let vacuum;
let treeVis;
let rows = 2;  // TODO: Add inputs to change these numbers
let columns = 2;
let intervalMs = 50;
let iteration = 0;
let vacuumRunning = null;

const updateIterationCount = (count) => {
    document.getElementById('iterationCount').innerText = count;
};

updateIterationCount(iteration);

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
    if (vacuum) {
        vacuum = undefined;
        iteration = 0;
        document.getElementById('pathResult').innerHTML = '';
    }
    // Get the number of rows and columns, defaulting to 2
    rows = parseInt(document.getElementById('rowCount').value) || 2;
    columns = parseInt(document.getElementById('colCount').value) || 2;
    // Get the search type
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
        case 'idls':
            vacuum = new IterativeDepthLimitedVacuum(rows, columns);
            break;
    }
};

document.getElementById('initButton').addEventListener('click', () => {
    initialiseVacuumWorld();
    vacuum.init();
    // Init creates the parent node we need for tree visualisation
    treeVis = new TreeVisualisation(vacuum.root);
    treeVis.drawIterative(vacuum.root);
});

document.getElementById('iterationButton').addEventListener('click', () => {
    iteration += 1;
    updateIterationCount(iteration);
    vacuum.runIteration();
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
        } else {
            iteration += 1;
            updateIterationCount(iteration);
            treeVis.drawIterative(vacuum.currentNode);
            vacuum.runIteration();
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
