import { Vector } from './math.js'

const k1 = 0.001;  // Repulsion constant
const k2 = 0.001;  // Time scaling factor
let MAX_VELOCITY = 100000;  // Maximum velocity magnitude
const EDGE_SPRING = 0.05; // Edge spring constant for attractive forces
const DECAY = 0.9999;
const IDEAL_LENGTH = 200; // Ideal edge length

function getForce(obj1, obj2) {
    // Calculate direction from obj1 to obj2
    let dir = obj1.pos.dir(obj2.pos);
    
    // Calculate distance between objects
    let distance = obj1.pos.sub(obj2.pos).abs();
    
    // Avoid division by zero
    if (distance < 0.001) distance = 0.001;
    
    // Calculate repulsive force (decreases with distance)
    let forceMagnitude = -1 / (distance * k1);
    
    // Return the force vector
    return dir.mult(forceMagnitude);
}

export class Simulator {
    constructor(objList, edgeList) {
        this.n = objList.length; 
        this.objList = objList;
        this.edgeList = edgeList; 
    }

    addNode(nd) {
        this.n++;
        this.objList.push(nd);
    }

    addEdge(e) {
        this.edgeList.push(e);
    }

    // Helper function to limit velocity
    limitVelocity(vel) {
        const speed = vel.abs();
        if (speed > MAX_VELOCITY) {
            return vel.mult(MAX_VELOCITY / speed);
        }
        return vel;
    }

    simulate(dt) {
        // Calculate repulsive forces between all nodes
        for(let i = 0; i < this.n; i++) {
            let obj1 = this.objList[i]; 
            for(let j = 0; j < this.n; j++) {
                if(i == j) continue;
                let obj2 = this.objList[j]; 
                let force = getForce(obj1, obj2); 
                obj1.vel = obj1.vel.add(force.mult(dt));
            }
        }

        // Apply edge forces (springs between connected nodes)
        for (let edge of this.edgeList) {
            const source = edge.v;
            const target = edge.u;
            
            // Get direction vector from source to target
            const direction = source.pos.dir(target.pos);
            
            // Calculate current distance
            const distance = source.pos.sub(target.pos).abs();
            
            // Calculate spring force (Hook's law: F = -k * (x - rest_length))
            const displacement = distance - IDEAL_LENGTH;
            const forceMagnitude = EDGE_SPRING * displacement;
            
            // Apply force to both nodes in opposite directions
            const force = direction.mult(forceMagnitude);
            
            // Apply to source (pulling towards target if too far, pushing if too close)
            source.vel = source.vel.add(force.mult(dt));
            
            // Apply to target (opposite direction)
            target.vel = target.vel.add(force.mult(-dt));
            
            // Apply velocity limits after adding spring forces
            source.vel = this.limitVelocity(source.vel);
            target.vel = this.limitVelocity(target.vel);
            MAX_VELOCITY = MAX_VELOCITY * DECAY;
        }
        
        for(let node of this.objList) {
            node.pos = node.pos.add(node.vel.mult(dt))
        }
    }
}