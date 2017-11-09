import uuidv4 from 'uuid/v4';

export default class SearchNode {
    constructor(state, parentNode, action) {
        this.state = JSON.parse(JSON.stringify(state));
        this.parentNode = parentNode;
        this.level = parentNode ? parentNode.level + 1 : 0;
        this.id = uuidv4();
        this.childNodes = [];
        this.action = action;
    }

    addChild(child) {
        this.childNodes.push(child);
    }

    stateString() {
        let stateStr = '';
        for (let i = 0; i < this.state.length; i++) {
            let rowString = '';
            for (let j = 0; j < this.state[0].length; j++) {
                rowString = `${rowString} | ${this.state[i][j]}`;
            }
            stateStr = `${stateStr}\n${rowString}`;
        }
        return stateStr;
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

    getPathToRoot() {
        let route = [];
        route.push({
            level: this.level,
            action: this.action,
            id: this.id
        });
        let parent = this.parentNode;
        while (parent) {
            if (parent.action) {
                route.push({
                    level: parent.level,
                    action: parent.action,
                    id: parent.id
                });
            }
            parent = parent.parentNode;
        }
        route.reverse();
        return route;
    }

    printPathToRoot() {
        let route = this.getPathToRoot();
        for (let i = 0; i < route.length; i++) {
            let node = route[i];
            console.log(`[${node.level}] ${node.action}`);
        }
        console.log(`Depth: ${route.length}`);
    }
}
