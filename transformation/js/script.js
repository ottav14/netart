import Triangle from './Triangle.js';

const lightColor = '#ededed';
const neutralColor = '#676767';
const darkColor = '#121212';
const explodeForce = 100;
const explodeScatterRate = 100;
const dotSpacing = 20;
const dotRadius = 1;
const dotSpeed = 0.1;
let time = 0;

const triangles = [];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const dotResX = canvas.width / dotSpacing;
const dotResY = canvas.width / dotSpacing;

ctx.fillStyle = darkColor;
ctx.strokeStyle = lightColor;

const explodeTriangles = () => {
    for(const triangle of triangles) {
        for(const node of triangle.nodes) {
            const dir = {
                x: canvas.width/2 - node.x + (2*Math.random()-1)*explodeScatterRate,
                y: canvas.height/2 - node.y + (2*Math.random()-1)*explodeScatterRate
            };
            const dist = Math.sqrt(dir.x*dir.x + dir.y*dir.y);
            node.accx -= dir.x / dist * explodeForce;
            node.accy -= dir.y / dist * explodeForce;
        }
    }
}

canvas.addEventListener('mousedown', (e) => {
    if(e.button == 0)
        triangles.push(new Triangle(e.clientX, e.clientY));
    else
        explodeTriangles();
});

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

const loop = () => {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = darkColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dots
    ctx.fillStyle = neutralColor;
    for(let i = -1; i < dotResY; i++) {
        for(let j = -1; j < dotResX; j++) {
            const x = dotSpacing * j + time % dotSpacing;
            const y = dotSpacing * i + time % dotSpacing;
            ctx.beginPath();
            ctx.arc(x, y, dotRadius + 0.2*Math.sin(0.3*time), 0, 2*Math.PI);
            ctx.fill();
        }
    }
    time += dotSpeed;

    // Triangles
    for(const triangle of triangles) {
        triangle.update(triangles);
        triangle.display(ctx);
    }

    requestAnimationFrame(loop);
}
loop();
