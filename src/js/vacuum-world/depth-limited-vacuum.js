import Vacuum from './models/vacuum';
import SearchNode from './models/search-node';

// Clean has been moved to the end since actions are stacked, not queued
const depthFirstPossibleActions = ['MU', 'ML', 'MD', 'MR', 'C'];
const depthLimit = 3;

export default class DepthLimited extends Vacuum {
    constructor(rows, columns) {
        super(rows, columns);
        this.stateStack = [];
    }

    runIteration() {
        if (!this.canContinue()) {
            return;
        }
        let validActions = this.getValidActions(this.currentNode.state);
        // For each of the valid actions, generate successors and add them to the queue
        let newStates = [];
        for (let i = 0; i < validActions.length; i++) {
            let action = validActions[i];
            // Generate the successor
            let successorNode = this.generateSuccessorNode(action, this.currentNode);
            // Only add the nodes if their level does not skip the depth limit
            if (successorNode.level <= depthLimit) {
                newStates.push(successorNode);
            }
        }
        // Add the new states to the queue
        this.stateStack = this.stateStack.concat(newStates);
        // Set the new states as the children of the current node (for vis purposes)
        for (let i = 0; i < newStates.length; i++) {
            let node = newStates[i];
            this.currentNode.addChild(node);
        }
        // Remove the last element from the queue
        this.currentNode = this.stateStack.pop();
    }

    // Override with new possible actions list
    getValidActions(state) {
        return super.getValidActions(state, depthFirstPossibleActions);
    }
 }
