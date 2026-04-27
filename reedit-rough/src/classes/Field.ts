import Camera from './Camera.ts';
import { batchCircle } from '../util/Draw.ts';
import Particle from './Particle.ts';
import Proton from './Proton.ts';
import Electron from './Electron.ts';
import Vector2 from './Vector2.ts';

const spacing = 20;
const radius = 1;
const bendFactor = 20;

const getScreenSpace = (x: number, y: number, camera: Camera) => {
    return new Vector2(
        x * spacing + camera.x % spacing,
        y * spacing + camera.y % spacing,
    );
}

class Field {
    constructor() {}

    sampleEMF(x: number, y: number, particles: Particle[], camera: Camera) {
        const res = new Vector2();
        const dummyParticle = new Electron(x - camera.x, y - camera.y);
        for(const particle of particles) {
            const EMF = particle.getElectromagneticForce(dummyParticle);
            res.add(EMF);
        }
        return res;
    }

    sampleSNF(x: number, y: number, particles: Particle[], camera: Camera) {
        const res = new Vector2();
        const dummyParticle = new Proton(x - camera.x, y - camera.y);
        for(const particle of particles) {
            const SNF = particle.getStrongNuclearForce(dummyParticle);
            res.add(SNF);
        }
        return res;
    }

    display(canvas: HTMLCanvasElement, camera: Camera, particles: Particle[]) {
        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        const resolutionX = canvas.width / spacing;
        const resolutionY = canvas.height / spacing;

        ctx.beginPath();
        for(let i = -1; i < resolutionY+1; i++) {
            for(let j = -1; j < resolutionX+1; j++) {
                const pos = getScreenSpace(j, i, camera);
                const EMF = this.sampleEMF(pos.x, pos.y, particles, camera);
                EMF.mult(bendFactor);

                batchCircle(
                    pos.x + EMF.x,
                    pos.y + EMF.y,
                    radius,
                    ctx
                );
            }
        }
        ctx.fillStyle = '#545454';
        ctx.fill();
    }

}
export default Field;
