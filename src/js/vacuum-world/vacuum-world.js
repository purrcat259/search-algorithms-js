import Node from './models/node';

/*
* State is a 2D array of integers which is represented using the following numbers:
* Clean = 0
* Dirty = 1
* Clean with Vacuum in the same tile = 2
* Dirty with Vacuum in the same tile = 3
*/

/*
* Actions are represented as strings:
* ML: Move Left
* MR: Move right
* MU: Move up
* MD: Move Down
* C: Clean
*/

let copy = (data) => {
    return JSON.parse(JSON.stringify(data));
};

let removeElement = (array, element) => {
    return array.filter((e) => {
        return e !== element;
    });
}

let possibleActions = ['MU', 'ML', 'MD', 'MR', 'C'];

export default class VacuumWorld {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.currentState = [];
        this.initialNode = null;
        this.currentNode = null;
        this.currentPosition = {
            row: -1,
            col: -1
        };
    }

    generate() {
        console.log(`Generating world with ${this.rows} rows and ${this.columns} columns`);
        // for (let i = 0; i < this.rows; i++) {
        //     // Generate an empty array to represent the row
        //     this.currentState.push([]);
        //     for (let j = 0; j < this.columns; j++) {
        //         // Have a 33% chance of the tile generated being dirty
        //         this.currentState[i].push();
        //     }
        // }
        // Hardcoded initial state:
        // TODO: generate it randomly
        this.currentState = [
            [1, 1],
            [1, 3]
        ];
        // TODO: return it rather than set it
    }

    // Using a breadth first search method
    run() {
        this.generate();
        let stateQueue = [];
        // Create the initial node
        let currentNode = new Node(this.currentState, null, null);
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
            console.log(stateQueue);
            // Remove the last element from the queue
            currentNode = stateQueue.shift();
        }
        console.log('Final state:');
        currentNode.print();
        console.log('Final path:');
        currentNode.printPathToRoot();
    }

    // Get the valid actions from the given state
    getValidActions(state) {
        // Get the co-ordinates of the robot in the given state
        let coordinates = this.getCoordinates(state);
        // Copy the possible actions array
        let currentPossibleActions = copy(possibleActions);
        // If the current position is at the edge, then we cannot move in a specific direction
        if (coordinates.row === 0) {
            currentPossibleActions = removeElement(currentPossibleActions, 'MU');
        }
        if (coordinates.row + 1 === this.rows) {
            currentPossibleActions = removeElement(currentPossibleActions, 'MD');
        }
        if (coordinates.col === 0) {
            currentPossibleActions = removeElement(currentPossibleActions, 'ML');
        }
        if (coordinates.col + 1 === this.columns) {
            currentPossibleActions = removeElement(currentPossibleActions, 'MR');
        }
        // Clean cannot occur in tiles with either state 0 (clean) or state 2 (clean with vacuum)
        // No need to check for state 0 since the vacuum can only clean its current tile
        if (state[coordinates.row][coordinates.col] == 2) {
            currentPossibleActions = removeElement(currentPossibleActions, 'C');
        }
        // console.log(`Current valid actions: ${currentPossibleActions.toString()}`);
        return currentPossibleActions;
    }

    getCoordinates(state) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                if (state[row][col] > 1) {
                    return {
                        row: row,
                        col: col
                    };
                }
            }
        }
    }

    // Generate successor states
    generateSuccessorNode(action, parentNode) {
        let successorState = copy(parentNode.state);
        let validActions = this.getValidActions(successorState);
        if (validActions.indexOf(action) < 0) {
            console.error(`Action: ${action} is illegal in the current state`);
            return;
        }
        // When vacuum enters a tile, do +2 to the new tile and -2 to the old tile. This preserves the clean/dirty state of either tile
        // If the vacuum is in a dirty tile and it decides to clean, simply do -1
        console.log(`Generating successor state for action: ${action}`);
        let coordinates = this.getCoordinates(successorState);
        switch (action) {
            case 'MU':
                successorState[coordinates.row][coordinates.col] -= 2;
                successorState[coordinates.row - 1][coordinates.col] += 2;
                break;
            case 'MR':
                successorState[coordinates.row][coordinates.col] -= 2;
                successorState[coordinates.row][coordinates.col + 1] += 2;
                break;
            case 'MD':
                successorState[coordinates.row][coordinates.col] -= 2;
                successorState[coordinates.row + 1][coordinates.col] += 2;
                break;
            case 'ML':
                successorState[coordinates.row][coordinates.col] -= 2;
                successorState[coordinates.row][coordinates.col - 1] += 2;
                break;
            case 'C':
                successorState[coordinates.row][coordinates.col] -= 1;
                break;
        }
        // console.log(`Successor state of action: ${action}`);
        let successorNode = new Node(successorState, parentNode, action);
        successorNode.print();
        return successorNode;
    }

    sendActionToVacuum(action) {
        switch (action) {
            case 'MU':
                this.currentPosition.row -= 1;
                break;
            case 'MR':
                this.currentPosition.col += 1;
                break;
            case 'MD':
                this.currentPosition.row += 1;
                break;
            case 'ML':
                this.currentPosition.col -= 1;
                break;
            case 'C':
                this.currentState[this.currentPosition.row][this.currentPosition.col] -= 2;
                break;
        }
        this.moveVacuum(this.currentPosition.row, this.currentPosition.col);
    }

    moveVacuum(row, col) {
        this.currentPosition.row = row;
        this.currentPosition.col = col;
    }

    goalReached(currentState) {
        // For the goal to be reached, all entries but one should be 2.
        // We can sum the values for all the entries in the state. If it is > 2 at any point then we stop checking
        let sum = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                sum += currentState[row][col];
                if (sum > 2) {
                    break;
                }
            }
            if (sum > 2) {
                break;
            }
        }
        return sum === 2;
    }
}
