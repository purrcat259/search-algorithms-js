import vis from 'vis';

export default class TreeVisualisation {
    constructor(root) {
        this.root = root;
        this.nodes = null;
        this.edges = null;
        this.network = null;
    }

    draw() {
        this.destroy();
        this.nodes = [];
        this.edges = [];
        // Add all the nodes from the root into this.nodes
        let treeNodes = this.extractAllNodes([this.root], []);
        // TODO: Convert to graph representation, with ID, Label and Level
        for (let i = 0; i < treeNodes.length; i++) {
            let node = treeNodes[i];
            this.nodes.push({id: node.id, label: node.stateString(), level: node.level});
        }
        // console.log(this.nodes);
        this.edges = this.generateEdges([this.root], []);
        // console.log(edges);
        let container = document.getElementById('networkVis');
        let data = {
            nodes: this.nodes,
            edges: this.edges
        };

        let options = {
            edges: {
                smooth: {
                    type: 'cubicBezier',
                    // forceDirection: (directionInput.value == "UD" || directionInput.value == "DU") ? 'vertical' : 'horizontal',
                        // roundness: 0.4
                    // }
                }
            },
            layout: {
                hierarchical: {
                    direction: 'UD'
                    // direction: directionInput.value
                }
            },
            physics: false
        }
        this.network = new vis.Network(container, data, options);
    }

    extractAllNodes(items, result) {
        items = items.slice(); // Copy the items to avoid mutating the actual object
        if (items.length) {
            let item = items.shift();
            result.push(item);

            let children = item.childNodes;
            if (children && children.length) {
                result = this.extractAllNodes(children, result);
            }

            return this.extractAllNodes(items, result);
        } else {
            return result;
        }
    }

    generateEdges(items, result) {
        items = items.slice();
        if (items.length) {
            let item = items.shift();
            let children = item.childNodes;
            if (children && children.length) {
                for (let i = 0; i < children.length; i++) {
                    let child = children[i];
                    result.push({from: item.id, to: child.id, label: child.action, font: {align: 'bottom'}});
                }
                result = this.generateEdges(children, result);
            }
            return this.generateEdges(items, result);
        } else {
            return result;
        }
    }

    destroy() {
        if (this.network) {
            this.network.destory();
            this.network = null;
        }
    }
}
