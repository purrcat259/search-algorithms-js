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
        let allNodes = this.extractAllNodes(this.root, []);
        console.log('Vis:');
        console.log(allNodes.length);
        console.log(allNodes);
    }

    extractAllNodes(root, nodes) {
        let children = root.childNodes;
        if (children && !children.length) {
            return [root];
        } else {
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                nodes = nodes.concat(this.extractAllNodes(child, nodes));
            }
            return nodes;
        }
    }

    destroy() {
        if (this.network) {
            this.network.destory();
            this.network = null;
        }
    }
}
