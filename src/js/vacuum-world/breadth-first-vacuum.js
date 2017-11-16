import Vacuum from './models/vacuum';
import SearchNode from './models/search-node';

export default class BreadthFirstVacuum extends Vacuum {
    constructor(rows, columns) {
        super(rows, columns);
        this.stateQueue = [];
    }

    runIteration() {
        let validActions = this.getValidActions(this.currentNode.state);
        // For each of the valid actions, generate successors and add them to the queue
        let newStates = [];
        for (let i = 0; i < validActions.length; i++) {
            let action = validActions[i];
            // Generate the successor
            let successorNode = this.generateSuccessorNode(action, this.currentNode);
            newStates.push(successorNode);
        }
        // Add the new states to the queue
        this.stateQueue = this.stateQueue.concat(newStates);
        // Set the new states as the children of the current node (for vis purposes)
        for (let i = 0; i < newStates.length; i++) {
            let node = newStates[i];
            this.currentNode.addChild(node);
        }
        // Remove the last element from the queue
        this.currentNode = this.stateQueue.shift();
    }
 }
