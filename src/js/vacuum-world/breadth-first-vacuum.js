import Vacuum from './models/vacuum';
import SearchNode from './models/search-node';

export default class BreadthFirstVacuum extends Vacuum {
    // Using a breadth first search method
    run() {
        let initialState = this.generate();
        let stateQueue = [];
        // Create the initial node
        let currentNode = new SearchNode(initialState, null, null);
        console.log('Initial state: ');
        currentNode.print();
        while (!this.goalReached(currentNode.state)) {
            let validActions = this.getValidActions(currentNode.state);
            console.log('------------------------------------');
            console.log('Current state: ');
            currentNode.print();
            console.log(`Current valid actions: ${validActions.join(', ')}`);
            // For each of the valid actions, generate successors and add them to the queue
            let newStates = [];
            validActions.forEach((action) => {
                // Generate the successor
                let successorNode = this.generateSuccessorNode(action, currentNode);
                newStates.push(successorNode);
            });
            // Add the new states to the queue
            stateQueue = stateQueue.concat(newStates);
            console.log(`Queue Length: ${stateQueue.length}`);
            // Remove the last element from the queue
            currentNode = stateQueue.shift();
        }
        console.log('Final state:');
        currentNode.print();
        console.log('Final path:');
        currentNode.printPathToRoot();
    }
}
