import { Vector } from './math.js'

export class Node {
    constructor(name) {
        this.name = name;
        this.pos = new Vector(100 + 200 * Math.random(), 100 + 200 * Math.random());
        this.vel = new Vector(0, 0); 
    }
}

export class Edge {
    constructor(node1, node2) {
        this.v = node1;
        this.u = node2;
    }
}

export class Graph {
    constructor(edges) {
        this.cnt = 0;
        this.adj = [];
        this.edgeList = [];
        this.nodeList = [];
        this.idxMap = new Map();
        
        for(let e of edges) {
            this.add_edge(e);
        }
    }    

    #insertNode(nd) {
        if(!this.idxMap.has(nd.name)) {
            this.idxMap.set(nd.name, this.cnt);
            this.adj.push([]);
            this.nodeList.push(nd);
            this.cnt++;
        }
    }

    add_edge(edge) {
        this.edgeList.push(edge); 
        this.#insertNode(edge.v);
        this.#insertNode(edge.u);
        let v = this.idxMap.get(edge.v.name)
        let u = this.idxMap.get(edge.u.name) 
        this.adj[v].push(u);
        this.adj[u].push(v); 
    }
}