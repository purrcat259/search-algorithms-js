import Node from './models/node';

export default class VacuumWorld {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
    }

    run() {
        console.log(`Starting from world with ${this.rows} rows and ${this.columns} columns`);
    }
}
