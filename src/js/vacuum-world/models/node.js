export default class Node {
    constructor(state, parentNode) {
        this.state = state;
        this.parentNode = parentNode;
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
    }

    printPathToRoot() {
        this.print();
        let parent = this.parentNode;
        while (parent) {
            console.log('------------------');
            parent.print();
            parent = parent.parentNode;
        }
    }
}
