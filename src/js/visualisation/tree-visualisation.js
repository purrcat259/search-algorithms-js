import vis from 'vis';

export default class TreeVisualisation {
    constructor(root) {
        this.root = root;
        this.nodes = [];
        this.edges = [];
        this.routeIds = [];
        this.network = null;
    }

    draw(currentNode) {
        // this.destroy();
        this.nodes = [];
        this.edges = [];
        // Add all the nodes from the root into this.nodes
        let treeNodes = this.extractAllNodes([this.root], []);
        // TODO: Convert to graph representation, with ID, Label and Level
        for (let i = 0; i < treeNodes.length; i++) {
            let node = treeNodes[i];
            let treeNode = {
                id: node.id,
                label: node.stateString(),
                level: node.level
            };
            // Draw the current node, if available
            if (currentNode) {
                if (treeNode.id === currentNode.id) {
                    treeNode.color = 'lime';
                }
            }
            this.nodes.push(treeNode);
        }
        // If the route IDs are available, change the colours of the nodes
        if (this.routeIds && this.routeIds.length) {
            // Add the route node id if it is not present
            if (this.routeIds.indexOf(this.root.id) === -1) {
                this.routeIds.push(this.root.id);
            }
            for (let i = 0; i < this.nodes.length; i++) {
                let node = this.nodes[i];
                if (this.routeIds.indexOf(node.id) !== -1) {
                    node.color = 'red';
                }
            }
        }
        // console.log(this.nodes);
        this.edges = this.generateEdges([this.root], []);
        // console.log(edges);
        this.drawNetwork(this.nodes, this.edges);
    }

    drawIterative(node) {
        // this.destroy();
        if (node) {
            // convert the node to the representation required for the graph
            let treeNode = {
                id: node.id,
                label: node.stateString(),
                level: node.level,
                color: 'lime'
            };
            this.nodes.push(treeNode);
            // Change the colour of the previous node back to blue
            if (this.nodes.length >= 2) {
                this.nodes[this.nodes.length - 2].color = 'blue';
            }
            if (node.parentNode) {
                this.edges.push(
                    {
                        from: node.parentNode.id,
                        to: node.id,
                        label: node.action,
                        font: {align: 'bottom'}
                    }
                );
            }
            this.drawNetwork(this.nodes, this.edges);
        }
    }

    drawNetwork(nodes, edges) {
        let container = document.getElementById('networkVis');
        let data = {
            nodes: nodes,
            edges: edges
        };

        let options = {
            edges: {
                smooth: {
                    type: 'cubicBezier',
                    forceDirection: 'vertical',
                    roundness: 0.4
                }
            },
            layout: {
                hierarchical: {
                    direction: 'UD'
                }
            },
            physics: false
        }
        this.network = new vis.Network(container, data, options);
    }

    highlightPathToRoute(route) {
        let routeIds = [];
        for (let i = 0; i < route.length; i++) {
            routeIds.push(route[i].id);
        }
        this.routeIds = routeIds;
        console.log('Highlighting Route');
        this.draw();
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
