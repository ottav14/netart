const moveSpeed = 10;
const zoomSpeed = 0.03;
const minZoom = 30;
const maxZoom = 250;
const pointSize = 5;
const panSmoothing = 0.15;
const zoomSmoothing = 0.15;

const keysHeld = new Set();

const camera = {
	x: 0,
	y: 0,
    desiredX: 0,
    desiredY: 0,
	zoom: 200,
    desiredZoom: 200
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.strokeStyle = '#000';
ctx.lineWidth = 4;

let mouseX = canvas.width/2;
let mouseY = canvas.height/2;

const mod = (x, n) => {
	while(x < 0)
		x += n;

	return x % n;
}

const lerp = (a, b, t) => {
    return t*b + a*(1-t);
}

const clearCanvas = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const setCol = (col) => {
	ctx.fillStyle = col;
}

const circle = (x, y, r) => {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.fill();
}

const line = (x1, y1, x2, y2) => {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

const hexagon = (x, y, s) => {
	const q = s*Math.sqrt(3)/2;

	ctx.beginPath();
	ctx.moveTo(x, y+s);
	ctx.lineTo(x+q, y+s/2);
	ctx.lineTo(x+q, y-s/2);
	ctx.lineTo(x, y-s);
	ctx.lineTo(x-q, y-s/2);
	ctx.lineTo(x-q, y+s/2);
	ctx.lineTo(x, y+s);
	ctx.stroke();
	ctx.fill();
}

const point = (x, y) => {
	  ctx.beginPath();
	  ctx.arc(x, y, pointSize, 0, Math.PI * 2);
	  ctx.fill();
}

const HexagonTiling = () => {
	const q = Math.sqrt(3)/2;
	const xCount = Math.ceil(canvas.width / camera.zoom / 2);
	const yCount = Math.ceil(canvas.height / q / camera.zoom / 2);
	const parity = Math.floor(camera.y / q);
	const midX = canvas.width/2;
	const midY = canvas.height/2;

	for(let n=-yCount-1; n<=yCount; n++) {
		const m0 = -xCount+(n+parity)%2*1/2;
		for(let m=m0; m<=xCount; m++) {
			const x = midX + camera.zoom*(m + mod(camera.x, 1));
			const y = midY + camera.zoom*(q*n + mod(camera.y, q));
			hexagon(x, y, camera.zoom/1.735);
		}
	}
}

const TriangleLattice = () => {
	const q = Math.sqrt(3)/2;
	const xCount = Math.ceil(canvas.width / camera.zoom / 2);
	const yCount = Math.ceil(canvas.height / q / camera.zoom / 2);
	const parity = Math.floor(camera.y / q);
	const midX = canvas.width/2;
	const midY = canvas.height/2;

	for(let n=-yCount; n<yCount; n++) {
		const m0 = -xCount+(n+parity)%2*1/2;
		for(let m=m0; m<xCount; m++) {
			const x = midX + camera.zoom*(m + mod(camera.x, 1));
			const y = midY + camera.zoom*(q*n + mod(camera.y, q));
			point(x, y, ctx);
		}
	}
}

const getHexagon = () => {
	const q = Math.sqrt(3)/2;
	const x = mouseX - canvas.width/2;
	const y = mouseY + canvas.height/2;
	const xf = Math.floor(x / camera.zoom);
	const yf = Math.floor(y / camera.zoom / q);
	return [ xf, yf ];
}

const handleKeyDown = (e) => {
	keysHeld.add(e.key);
}
document.addEventListener('keydown', handleKeyDown);

const handleKeyUp = (e) => {
	keysHeld.delete(e.key);
}
document.addEventListener('keyup', handleKeyUp);

const handleResize = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
window.addEventListener('resize', handleResize);

const handleMouseMove = (e) => {
	mouseX = e.clientX;
	mouseY = -e.clientY;
}
window.addEventListener('mousemove', (e) => handleMouseMove(e));

const update = () => {
	let dx = Number(keysHeld.has('a')) - Number(keysHeld.has('d'));
	let dy = Number(keysHeld.has('w')) - Number(keysHeld.has('s'));

    const mag = Math.sqrt(dx*dx + dy*dy);
    if(mag > 0) {
        dx /= mag;
        dy /= mag;
    }

    camera.desiredX += dx * moveSpeed / camera.zoom;
    camera.desiredY += dy * moveSpeed / camera.zoom;

    camera.x = lerp(camera.x, camera.desiredX, panSmoothing);
    camera.y = lerp(camera.y, camera.desiredY, panSmoothing);

	const newZoom = camera.desiredZoom * (1 - zoomSpeed * (Number(keysHeld.has('ArrowDown')) - Number(keysHeld.has('ArrowUp'))));
	camera.desiredZoom = newZoom >= minZoom && newZoom <= maxZoom ? newZoom : camera.desiredZoom;
    camera.zoom = lerp(camera.zoom, camera.desiredZoom, zoomSmoothing);

	clearCanvas(canvas);

	setCol('#fff');
	HexagonTiling();
	setCol('#000');
	TriangleLattice();
	
	requestAnimationFrame(update);
}
update();
