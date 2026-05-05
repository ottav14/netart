<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import Particle from './classes/Particle.ts';
    import Camera from './classes/Camera.ts';
    import Field from './classes/Field.ts';
    import { Text, Button, Slider, TextInput, Toggle } from '@ottav14/dui';

    const bloomBlur: number = 20;

    let canvas: HTMLCanvasElement;
    let mouseMode: string = 'particle';
    let particles: Particle[] = [];
    let camera = new Camera();
    let mouseHeld = false;
    let particleMenuOpen = false;
    let visualsMenuOpen = false;
    let helpMenuOpen = false;

    const displayParams: Record<string, any> = {
        'showRanges': false,
        'minimalParticles': false,
    };

    const physicsParams: Record<string, any> = {
        'electromagneticRange': 300,
        'electromagneticStrength': 0.03,
    };

    const field = new Field();

    const particleTypes = [
        new Particle(0, 0, 50, '255, 105, 105', '255, 77, 77', 1, 1, 'R'),
        new Particle(0, 0, 50, '138, 138, 138', '110, 110, 110', 0, 1, 'W'),
        new Particle(0, 0, 30, '161, 161, 255', '125, 125, 255', -1, 0, 'B')
    ];

    let currentParticleIX = 0;

    const createParticle = (x: number, y: number) => {
        const data = particleTypes[currentParticleIX];
        particles.push(new Particle(
            x,
            y,
            data.m,
            data.color,
            data.borderColor,
            data.electromagneticCharge,
            data.strongNuclearCharge,
            data.symbol
        ));
    }

    const updateParticles = () => {
        for(const particle of particles)
            particle.update(particles, physicsParams);
    }

    const updateParticleParameter = (mass: number) => {
        particleTypes[currentParticleIX].m = mass;
        const symbol = particleTypes[currentParticleIX].symbol;
        for(const particle of particles) {
            if(particle.symbol === symbol) { 
                particle.m = mass;
            }
        }
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
            particle.display(temp, camera, displayParams, physicsParams);

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

        field.display(canvas, camera, particles, physicsParams);

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
    <div class="buttonContainer">
        <div class="particleButtonContainer">
            {#each particleTypes as data, i}
                <Button 
                    text={data.symbol}
                    onClick={() => {
                        particleMenuOpen = i == currentParticleIX ? !particleMenuOpen : false;
                        currentParticleIX = i;
                    }}
                    bloom={true}
                    primaryColor="transparent"
                    secondaryColor={data.color}
                    toggle={i == currentParticleIX}
                    margin={1}
                />
            {/each}
            {#if particleMenuOpen}
                <div class="particleMenu" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
                    <div class="particleLabelContainer">
                        <TextInput
                            type="single"
                            uppercase={true}
                            value={particleTypes[currentParticleIX].symbol}
                            onInput={(e) => {if(e.data) particleTypes[currentParticleIX].symbol = e.data.toUpperCase()}}
                            margin={0}
                        />
                        <Text
                            text="P A R T I C L E"
                            padding={1}
                        />
                    </div>
                    <div class="uiGroup">
                        <Text 
                            text="Mass:"
                        />
                        <Slider 
                            onChange={(val: number) => updateParticleParameter(val)}
                            value={particleTypes[currentParticleIX].m}
                            min={15}
                        />
                    </div>
                </div>
            {/if}
        </div>
        <div class="settingsButtonsContainer">
            <Button 
                primaryColor="transparent"
                margin={1}
                onClick={() => {
                    helpMenuOpen = !helpMenuOpen;
                    visualsMenuOpen = false;
                }}
                text="?"
                toggle={helpMenuOpen}
            />
            <Button 
                type="visuals"
                primaryColor="transparent"
                margin={1}
                onClick={() => {
                    visualsMenuOpen = !visualsMenuOpen;
                    helpMenuOpen = false;
                }}
                toggle={visualsMenuOpen}
            />
            {#if visualsMenuOpen}
                <div class="visualsMenu" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
                    <div class="uiGroup">
                        <Text text="Minimal particle display:" />
                        <Toggle onInput={() => displayParams['minimalParticles'] = !displayParams['minimalParticles']} />
                    </div>
                    <div class="uiGroup">
                        <Text text="Show force ranges:" />
                        <Toggle onInput={() => displayParams['showRanges'] = !displayParams['showRanges']} />
                    </div>
                </div>
            {:else if helpMenuOpen}
                <div class="helpMenuContainer" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
                    <div class="helpMenu" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
                        <Text 
                            type="h2"
                            text="Help text!!!"
                            bold={true}
                        />
                        <Text 
                            padding={1}
                            text={`This is my help text. I would never put help text in any site that I make
                             for artistic reasons. If it's a tool for people to use then sure.
                             But if it's made for the sake of art, why would I give a single 
                             expletive whether every user finds every feature, or whether it's 
                             immediately clear what something does. Maybe I'm weird, but to me,
                             one of the greatest strengths of software as an art form is the 
                             sense of exploration it can provide. I think anyone who actively
                             works to eliminate any semblance of that feeling at the very least
                             meaningfully misunderstands the point of any of this.
                            `}
                         />
                        <Text 
                            padding={1}
                            text={`The buttons labeled 'R', 'W', and 'B',
                            determine what kind of particle you will create 
                            when you left click anywhere in the game area.
                            Shift left click + panning in the game area 
                            lets you pan the camera. If you click the currently
                            selected particle button again, it will open 
                            an additional menu which allows you to change its
                            mass and name. The button with the eye in it opens
                            a menu which allows you to toggle different visual 
                            effects. That's about every mapped input I can think of.
                            Oh, if you resize the window the game area will change size
                            accordingly. If you use your browsers built in zoom function,
                            it actually zooms in and out of the game area. Though this 
                            is not intended behavior and will lead to instability.
                            You officially have nothing left to discover and all 
                            mystique of what is available is now gone. At least 
                            you can still play around with it.
                            `}
                         />
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>
<canvas 
    bind:this={canvas}
    style={`
        cursor: ${mouseMode === 'panning' ? (mouseHeld ? 'grabbing' : 'grab') : 'crosshair'}
    `}
 >
</canvas>

<style>
    .ui {
        position: absolute;
        top: 2rem;
        left: 2rem;
        height: 100%;
    }

    .buttonContainer {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 94%;
    }

    .particleLabelContainer {
        display: flex;
        align-items: center;
    }

    .uiGroup {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .particleMenu {
        position: absolute;
        width: 35rem;
        padding: 2rem;
        background-color: #101010;
        z-index: -1;
        top: 0;
        left: 100%;
        box-shadow:
            20px 20px 20px rgba(0, 0, 0, 0.2),
            20px 20px 20px rgba(0, 0, 0, 0.1);
    }

    .visualsMenu {
        position: absolute;
        width: 30rem;
        background-color: #101010;
        padding: 1rem;
        padding-left: 2rem;
        z-index: -1;
        bottom: 0;
        left: 100%;
        box-shadow:
            20px 20px 20px rgba(0, 0, 0, 0.2),
            20px 20px 20px rgba(0, 0, 0, 0.1);
    }

    .helpMenuContainer {
        position: absolute;
        top: -3vh;
        left: -1vw;
        width: 100vw;
        height: 100vh;
        background: #10101088;
        z-index: -1;
    }

    .helpMenu {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        bottom: 8vh;
        left: 25vw;
        width: 50vw;
        background-color: #101010;
        padding: 1rem;
        padding-left: 2rem;
        z-index: -1;
        box-shadow:
            20px 20px 20px rgba(0, 0, 0, 0.2),
            20px 20px 20px rgba(0, 0, 0, 0.1);
    }

    canvas {
        position: absolute;
        z-index: -2;
    }

</style>
