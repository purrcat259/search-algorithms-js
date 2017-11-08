import Vacuum from './models/vacuum';
import SearchNode from './models/search-node';

export default class BreadthFirstVacuum extends Vacuum {
    constructor(rows, columns) {
        super(rows, columns);
        this.initalState = null;
        this.stateQueue = [];
        this.currentNode = null;
        this.root = null;
    }

    init() {
        this.initialState = this.generate();
        // Create the initial node
        this.currentNode = new SearchNode(this.initialState, null, null);
        console.log('Initial state: ');
        this.currentNode.print();
        this.root = this.currentNode; // TODO check if this works since current node is reassigned
    }

    // Using a breadth first search method
    run() {
        while (!this.goalReached(this.currentNode.state)) {
            this.runIteration();
        }
        console.log('Final state:');
        this.currentNode.print();
        console.log('Final path:');
        this.currentNode.printPathToRoot();
    }

    runIteration() {
        let validActions = this.getValidActions(this.currentNode.state);
        // console.log('------------------------------------');
        // console.log('Current state: ');
        // this.currentNode.print();
        // console.log(`Current valid actions: ${validActions.join(', ')}`);
        // For each of the valid actions, generate successors and add them to the queue
        let newStates = [];
        validActions.forEach((action) => {
            // Generate the successor
            let successorNode = this.generateSuccessorNode(action, this.currentNode);
            newStates.push(successorNode);
        });
        // Add the new states to the queue
        this.stateQueue = this.stateQueue.concat(newStates);
        // Set the new states as the children of the current node (for vis purposes)
        newStates.forEach((node) => {
            this.currentNode.addChild(node);
        });
        console.log(`Queue Length: ${this.stateQueue.length}`);
        // Remove the last element from the queue
        this.currentNode = this.stateQueue.shift();
    }
 }
