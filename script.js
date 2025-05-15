import * as graph from './graph.js'
import * as physics from './physics.js'

const canvas = document.getElementById("graphCanvas");
if (!canvas) {
    console.error("Canvas element not found! Check if the ID is correct.");
    throw new Error("Canvas element not found");
}

const ctx = canvas.getContext("2d");
if (!ctx) {
    console.error("2D context not supported or couldn't be created");
    throw new Error("2D context not available");
}

console.log("Canvas and context initialized successfully");
console.log("Canvas dimensions:", canvas.width, "x", canvas.height);

let nodeList = [
    [0],
    [1],
    [2],
    [3],
    [4],
    [5],
    [6],
    [7],
    [8],
    [9],
    [10],
    [11],
    [12],
    [13],
    [14],
    [15],
    [16],
    [17],
    [18],
    [19],
    [20],
    [21],
    [22],
    [23],
    [24],
    [25],
    [26],
    [27],
    [28],
    [29],
    [30],
    [31],
    [32],
    [33],
    [34],
    [35],
    [36],
    [37],
    [38],
    [39],
    [40],
    [41],
    [42],
    [43],
    [44],
    [45],
    [46],
    [47],
    [48],
    [49]
]

let nodes = [];
for(let nd of nodeList) {
    nodes.push(new graph.Node(nd[0]));
}

let edgeList = [
    [nodes[18], nodes[13]],
    [nodes[14], nodes[0]],
    [nodes[6], nodes[5]],
    [nodes[7], nodes[3]],
    [nodes[9], nodes[14]],
    [nodes[6], nodes[18]],
    [nodes[6], nodes[7]],
    [nodes[15], nodes[3]],
    [nodes[12], nodes[10]],
    [nodes[5], nodes[14]],
    [nodes[17], nodes[19]],
    [nodes[15], nodes[13]],
    [nodes[15], nodes[14]],
    [nodes[3], nodes[2]],
    [nodes[17], nodes[14]],
    [nodes[16], nodes[14]],
    [nodes[17], nodes[16]],
    [nodes[0], nodes[7]],
    [nodes[5], nodes[0]],
    [nodes[14], nodes[4]],
    [nodes[7], nodes[8]],
    [nodes[4], nodes[12]],
    [nodes[17], nodes[6]],
    [nodes[15], nodes[9]],
    [nodes[8], nodes[19]],
    [nodes[13], nodes[4]],
    [nodes[10], nodes[14]],
    [nodes[12], nodes[0]],
    [nodes[18], nodes[8]],
    [nodes[2], nodes[17]],
    [nodes[11], nodes[4]],
    [nodes[11], nodes[15]],
    [nodes[13], nodes[11]],
    [nodes[8], nodes[5]],
    [nodes[9], nodes[2]],
    [nodes[12], nodes[1]],
    [nodes[3], nodes[1]],
    [nodes[6], nodes[12]],
    [nodes[13], nodes[9]],
    [nodes[0], nodes[18]],
    [nodes[7], nodes[0]],
    [nodes[5], nodes[16]],
    [nodes[14], nodes[16]],
    [nodes[10], nodes[6]],
    [nodes[10], nodes[17]],
    [nodes[8], nodes[7]],
    [nodes[8], nodes[14]],
    [nodes[15], nodes[7]],
    [nodes[15], nodes[19]],
    [nodes[13], nodes[8]]
]

let edges = [];
for (let e of edgeList) {
    edges.push(new graph.Edge(e[0], e[1]));
}

let g = new graph.Graph(edges);

// Initialize the physics simulator with all nodes from the graph
let sim = new physics.Simulator(g.nodeList, g.edgeList);

// Animation variables
let animationRunning = true;
let lastTimestamp = 0;

// Function to resize canvas properly
function resizeCanvas() {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Only adjust dimensions if necessary
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        console.log("Resizing canvas from", canvas.width, "x", canvas.height, "to", displayWidth, "x", displayHeight);
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}

// Draw function with debug logging
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 2;
    for(let e of g.edgeList) {
        let posv = e.v.pos;
        let posu = e.u.pos; 

        ctx.beginPath();
        ctx.moveTo(posv.x, posv.y);
        ctx.lineTo(posu.x, posu.y);
        ctx.stroke();
    }

    // Draw nodes
    for(let nd of g.nodeList) {
        ctx.beginPath();
        ctx.arc(nd.pos.x, nd.pos.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "steelblue";
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.stroke();

        // Add text
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(nd.name.toString(), nd.pos.x, nd.pos.y);
    }
}

// Animation function that will use the simulator
function animate(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = Math.min((timestamp - lastTimestamp) / 1000, 0.09); 
    lastTimestamp = timestamp;
    
    if (animationRunning) {
        // Run physics simulation
        sim.simulate(deltaTime);

        // Keep nodes within canvas bounds
        const padding = 30; // Keep nodes away from the edges
        for (let node of g.nodeList) {
            node.pos.x = Math.max(padding, Math.min(canvas.width - padding, node.pos.x));
            node.pos.y = Math.max(padding, Math.min(canvas.height - padding, node.pos.y));
        }
        
        // Draw the graph
        draw();
    }
    
    // Request next frame - correctly passing the function reference, not its result
    requestAnimationFrame(animate);
}

// Set up event listeners
function setupEventListeners() {
    console.log("Setting up event listeners");

    // Resize listener
    window.addEventListener("resize", function () {
        console.log("Resize event triggered");
        resizeCanvas();
        draw();
    });

    // Dragging functionality
    let draggedNode = null;

    canvas.addEventListener("mousedown", function (e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Check if we're clicking on a node
        for(let nd of g.nodeList) {
            let dx = mouseX - nd.pos.x; 
            let dy = mouseY - nd.pos.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if(dist <= 20) {
                console.log("Node selected:", nd.name);
                draggedNode = nd;
                
                // Stop animation while dragging
                animationRunning = false;
                
                // Reset velocity when grabbed
                draggedNode.vel.x = 0;
                draggedNode.vel.y = 0;
                break;
            }
        }
    });

    canvas.addEventListener("mousemove", function (e) {
        if (draggedNode) {
            const rect = canvas.getBoundingClientRect();
            draggedNode.pos.x = e.clientX - rect.left;
            draggedNode.pos.y = e.clientY - rect.top;
            draw();
        }
    });

    canvas.addEventListener("mouseup", function () {
        if (draggedNode) {
            console.log("Node released:", draggedNode.name);
            draggedNode = null;
            
            // Resume animation after dragging
            animationRunning = true;
        }
    });

    console.log("Event listeners set up successfully");
}

// Initialize everything
function init() {
    console.log("Initializing graph visualization");
    resizeCanvas();
    setupEventListeners();
    
    // Place nodes initially in a circle
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 3;
    
    g.nodeList.forEach((node, index) => {
        const angle = (index / g.nodeList.length) * 2 * Math.PI;
        node.pos.x = centerX + radius * Math.cos(angle);
        node.pos.y = centerY + radius * Math.sin(angle);
        // Initialize with zero velocity
        node.vel.x = 0;
        node.vel.y = 0;
    });
    
    // Start the animation with current timestamp
    requestAnimationFrame((timestamp) => {
        lastTimestamp = timestamp;
        animate(timestamp);
    });
    
    console.log("Initialization complete");
}

// Start everything when the document is fully loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}