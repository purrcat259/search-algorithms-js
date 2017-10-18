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

export default class VacuumWorld {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.currentState = [];
        this.initialNode = null;
        this.currentNode = null;
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
        this.initialNode = new Node(JSON.parse(JSON.stringify(this.currentState)), null);
        this.currentNode = this.initialNode;
        console.log('Initial state: ');
        this.currentNode.print();
    }

    run() {
        this.generate();
    }
}
