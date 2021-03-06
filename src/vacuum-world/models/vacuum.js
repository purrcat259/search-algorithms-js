import SearchNode from './search-node';

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

let defaultPossibleActions = ['C', 'MU', 'ML', 'MD', 'MR'];

export default class Vacuum {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.initalState = null;
        this.currentNode = null;
        this.root = null;
    }


    init() {
        this.initialState = this.generate();
        // Create the initial node
        this.currentNode = new SearchNode(this.initialState, null, null);
        this.root = this.currentNode;
    }

    generate() {
        let initialState = [];
        console.log(`Generating world with ${this.rows} rows and ${this.columns} columns`);
        for (let i = 0; i < this.rows; i++) {
            // Generate an empty array to represent the row
            initialState.push([]);
            for (let j = 0; j < this.columns; j++) {
                // Have an 80% chance of the tile generated being dirty
                let randomVal = Math.random();
                initialState[i].push(randomVal < 0.80 ? 1 : 0);
            }
        }
        // Place the vacuum down in a random position by doing +2
        let randomRow = Math.floor(Math.random() * this.rows);
        let randomCol = Math.floor(Math.random() * this.columns);
        initialState[randomRow][randomCol] += 2;
        // initialState = [
        //     [1, 1],
        //     [1, 3]
        // ];
        return initialState;
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
        // console.log(`Generating successor state for action: ${action}`);
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
        let successorNode = new SearchNode(successorState, parentNode, action);
        successorNode.print();
        return successorNode;
    }

    // Get the valid actions from the given state
    getValidActions(state, possibleActions) {
        possibleActions = possibleActions || defaultPossibleActions;
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

    canContinue() {
        return !this.goalReached() && !this.noPathFound();
    }

    goalReached() {
        if (!this.currentNode) {
            return;
        }
        let state = this.currentNode.state;
        // For the goal to be reached, all entries but one should be 2.
        // We can sum the values for all the entries in the state. If it is > 2 at any point then we stop checking
        let sum = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                sum += state[row][col];
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

    noPathFound() {
        return !this.currentNode;
    }
}
