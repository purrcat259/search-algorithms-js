import * as vis from 'vis';

export default class TreeVisualisation {
    constructor(root) {
        this.root = root;
        this.nodes = [];
        this.edges = [];
        this.routeIds = [];
        this.network = null;
    }

    draw(currentNode) {
        this.nodes = [];
        this.edges = [];
        // Add all the nodes from the root into this.nodes
        let treeNodes = this.extractAllNodes([this.root], []);
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
        // console.log(this.nodes);
        this.edges = this.generateEdges([this.root], []);
        // console.log(edges);
        // this.destroy();
        this.drawNetwork(this.nodes, this.edges);
    }

    drawIterative(node) {
        // this.destroy();
        // If passed the root, redraw from scratch instead
        if (node && node.id === this.root.id) {
            this.draw(node);
            return;
        }
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
        }
        this.drawNetwork(this.nodes, this.edges);
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
        this.network.fit();
    }

    highlightPathToRoute(route) {
        let routeIds = [];
        for (let i = 0; i < route.length; i++) {
            routeIds.push(route[i].id);
        }
        // Add the root
        routeIds.push(this.root.id);
        for (let i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i];
            if (routeIds.indexOf(node.id) !== -1) {
                node.color = 'red';
            }
        }
        console.log('Highlighting Route');
        this.drawNetwork(this.nodes, this.edges);
    }

    showNoPathFound() {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].color = 'red';
        }
        // TODO: this.nodes is rewritten after .draw()
        console.log('Showing no path found');
        this.drawNetwork(this.nodes, this.edges);
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
