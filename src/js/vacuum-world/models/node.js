export default class Node {
    constructor(state, parentNode, action) {
        this.state = state;
        this.parentNode = parentNode;
        this.action = action;
    }

    print() {
        for (let i = 0; i < this.state.length; i++) {
            let rowString = '';
            for (let j = 0; j < this.state[0].length; j++) {
                rowString = `${rowString} | ${this.state[i][j]}`;
            }
            rowString = `${rowString} |`;
            console.log(rowString);
        }
        console.log(`Action: ${this.action}`);
    }

    printPathToRoot() {
        console.log(this.action);
        let parent = this.parentNode;
        while (parent) {
            console.log(parent.action);
            parent = parent.parentNode;
        }
    }
}
