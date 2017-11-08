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

    }

    destroy() {
        if (this.network) {
            this.network.destory();
            this.network = null;
        }
    }
}
