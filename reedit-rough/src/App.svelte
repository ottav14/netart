<script lang="ts">
    import { onMount } from 'svelte';
    import Particle from './classes/Particle.ts';
    import Proton from './classes/Proton.ts';
    import Neutron from './classes/Neutron.ts';
    import Electron from './classes/Electron.ts';
    import Camera from './classes/Camera.ts';
    import Field from './classes/Field.ts';
    import { Button } from '@ottav14/dui';

    const bloomBlur: number = 20;

    let canvas: HTMLCanvasElement;
    let mouseMode: string = 'particle';
    let particleCreationMode: string = 'P';
    let particles: Particle[] = [];
    let camera = new Camera();
    let mouseHeld = false;
    let showRanges = false;
    let minimalParticles = false;

    let PButtonToggle: boolean = true;
    let NButtonToggle: boolean = false;
    let EButtonToggle: boolean = false;
    let particleButtonToggles: boolean[] = [
        PButtonToggle,
        NButtonToggle,
        EButtonToggle
    ];

    const field = new Field();

    const createParticle = (x: number, y: number, type: string) => {
        switch(type) {
            case 'P':
                particles.push(new Proton(x, y));
                break;
            case 'N':
                particles.push(new Neutron(x, y));
                break;
            case 'E':
                particles.push(new Electron(x, y));
                break;
        }
    }

    const updateParticles = () => {
        for(const particle of particles) {
            particle.update(particles);
        }
    }

    const setParticleCreationMode = (val: string) => {
        for(let i = 0; i < particleButtonToggles.length; i++)
            particleButtonToggles[i] = false;

        const ix = val === 'P' ? 0 : (val === 'N' ? 1 : 2);
        particleButtonToggles[ix] = true;
        particleCreationMode = val;
    }

    const handleKeydown = (e: KeyboardEvent) => {
        switch(e.key) {
            case 'Shift':
                mouseMode = 'panning';
                break;
        }
    }

    const handleKeyup = (e: KeyboardEvent) => {
        switch(e.key) {
            case 'Shift':
                mouseMode = 'particle';
                break;
        }
    }

    const handleMouseDown = (e: MouseEvent) => {
        mouseHeld = true;
        switch(mouseMode) {
            case 'particle':
                createParticle(
                    e.clientX - camera.x,
                    e.clientY - camera.y,
                    particleCreationMode
                );
                break;
            case 'panning':
                break;
        }
    }

    const handleMouseMove = (e: MouseEvent) => {
        if(mouseMode === 'panning' && mouseHeld) {
            camera.pan(e);
        }
    }

    const bloom = (ctx: CanvasRenderingContext2D, particlePass: HTMLCanvasElement) => {
        ctx.filter = `blur(${bloomBlur}px)`;
        ctx.globalCompositeOperation = "lighter";

        ctx.drawImage(particlePass, 0, 0);

        ctx.filter = "none";
        ctx.globalCompositeOperation = "source-over";
    }

    const particleDrawPass = () => {
        const temp = document.createElement("canvas");
        temp.width = canvas.width;
        temp.height = canvas.height;
        
        for(const particle of particles)
            particle.display(temp, camera, showRanges, minimalParticles);

        return temp;
    }

    const loop = () => {
        const ctx = canvas.getContext('2d');
        if(!ctx)
            throw new Error('Failed to retrieve canvas rendering context.');

        camera.update();
        updateParticles();

        ctx.fillStyle = '#101010';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        field.display(canvas, camera, particles);

        const particlePass = particleDrawPass();
        ctx.drawImage(particlePass, 0, 0);

        bloom(ctx, particlePass);
        
        requestAnimationFrame(loop);
    }

    onMount(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        canvas.addEventListener('mousedown', (e) => handleMouseDown(e));
        window.addEventListener('mouseup', () => mouseHeld = false);
        window.addEventListener('mousemove', (e) => handleMouseMove(e));
        window.addEventListener('keydown', (e) => handleKeydown(e));
        window.addEventListener('keyup', (e) => handleKeyup(e));

        loop();
    });
</script>

<div class="ui">
    <Button 
        text="P" 
        onClick={() => setParticleCreationMode('P')}
        bottomBorder={false} 
        toggle={PButtonToggle}
    />
    <Button 
        text="N" 
        onClick={() => setParticleCreationMode('N')}
        bottomBorder={false} 
        toggle={NButtonToggle}
    />
    <Button 
        text="E" 
        onClick={() => setParticleCreationMode('E')}
        bottomBorder={false} 
        toggle={EButtonToggle}
    />
    <Button 
        text="C"
        onClick={() => showRanges = !showRanges}
        bottomBorder={false} 
        toggleButton={true}
    />
    <Button 
        text="M"
        onClick={() => minimalParticles = !minimalParticles}
        toggleButton={true}
    />
</div>
<canvas 
    bind:this={canvas}
    style={`
        cursor: ${mouseMode === 'panning' ? (mouseHeld ? 'grabbing' : 'grab') : 'default'}
    `}
 >
</canvas>

<style>
    .ui {
        position: absolute;
        top: 2rem;
        left: 2rem;
    }
</style>
