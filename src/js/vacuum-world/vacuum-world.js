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

let possibleActions = ['MU', 'ML', 'MD', 'MR', 'MD'];

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
        // Set the current position
        this.currentPosition.row = 1;
        this.currentPosition.col = 1;
        // Create the initial node
        this.initialNode = new Node(copy(this.currentState), null);
        this.currentNode = this.initialNode;
        console.log('Initial state: ');
        this.currentNode.print();
    }

    run() {
        this.generate();
        this.generateSuccessors();
    }

    // Get the valid actions from the current state
    getValidActions() {
        // Copy the possible actions array
        let currentPossibleActions = copy(possibleActions);
        // If the current position is at the edge, then we cannot move in a specific direction
        if (this.currentPosition.row === 0) {
            currentPossibleActions = removeElement(currentPossibleActions, 'MU');
        }
        if (this.currentPosition.row + 1 === this.rows) {
            currentPossibleActions = removeElement(currentPossibleActions, 'MD');
        }
        if (this.currentPosition.col === 0) {
            currentPossibleActions = removeElement(currentPossibleActions, 'ML');
        }
        if (this.currentPosition.col + 1 === this.columns) {
            currentPossibleActions = removeElement(currentPossibleActions, 'MR');
        }
        console.log(`Current valid actions: ${currentPossibleActions.toString()}`);
        return currentPossibleActions;
    }

    // Generate successor states
    generateSuccessor(action) {
        let validActions = this.getValidActions();
        if (validActions.indexOf(action) < 0) {
            console.log(`Action: ${action} is illegal in the current state`);
        }
        let successorState = copy(this.currentState);
        // When vacuum enters a tile, do +2 to the new tile and -2 to the old tile. This preserves the clean/dirty state of either tile
        // If the vacuum
        switch (action) {
            case 'MU':

        }
    }
}
