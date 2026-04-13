import Node from './Node.js';

const springForce = 0.1;
const repelForce = 50;
const gravityForce = 0.1;
const dragRate = 0.9;

const s = 50;
const h = Math.sqrt(3)/2 * s;

const line = (a, b, ctx) => {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
}

const getDir = (a, b) => {
    return { 
        x: b.x - a.x,
        y: b.y - a.y
    };
}

const getLength = (v) => {
    return Math.sqrt(v.x*v.x + v.y*v.y);
}

class Triangle {
    constructor(x, y) {
        this.nodes = [
            new Node(x,       y - h*2/3),
            new Node(x - s/2, y + h/3),
            new Node(x + s/2, y + h/3)
        ];
    }

    display(ctx) {
        line(this.nodes[0], this.nodes[1], ctx);
        line(this.nodes[1], this.nodes[2], ctx);
        line(this.nodes[2], this.nodes[0], ctx);
    }

    update(others) {


        for(const node of this.nodes) {
            // Others
            for(const other of others) {
                if(other !== this) {
                    for(const otherNode of other.nodes) {
                        // Repel
                        const dir = getDir(node, otherNode);
                        const dist = getLength(dir);
                        if(dist > 0) {
                            node.accx -= dir.x / dist / dist * repelForce;
                            node.accy -= dir.y / dist / dist * repelForce;
                        }
                    }
                }
            }

            // Self
            for(const neighbor of this.nodes) {
                if(node !== neighbor) {
                    // Springs
                    const dir = getDir(node, neighbor);
                    const dist = getLength(dir);
                    const delta = dist - s;

                    if(dist > 0) {
                        node.accx += dir.x / dist * delta * springForce;
                        node.accy += dir.y / dist * delta * springForce;
                    }
                }
            }

            // Gravity
            const canvas = document.getElementById('canvas');
            const gravityDir = getDir(node, new Node(canvas.width/2, canvas.height/2));
            const gravityDist = getLength(gravityDir);
            if(gravityDist > 0) {
                node.accx += gravityDir.x * gravityForce;
                node.accy += gravityDir.y * gravityForce;
            }

            // Drag
            node.accx -= node.velx * dragRate;
            node.accy -= node.vely * dragRate;

            // Physics loop
            node.velx += node.accx;
            node.vely += node.accy;

            node.x += node.velx;
            node.y += node.vely;

            node.accx = 0;
            node.accy = 0;
        }

    }
}
export default Triangle;
