export default class SearchNode {
    constructor(state, parentNode, action) {
        this.state = JSON.parse(JSON.stringify(state));
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
        let route = [];
        route.push(this.action);
        let parent = this.parentNode;
        while (parent) {
            if (parent.action) {
                route.push(parent.action);
            }
            parent = parent.parentNode;
        }
        route.reverse();
        console.log(route.join('\n'));
        console.log(`Depth: ${route.length}`);
    }
}
