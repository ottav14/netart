<script lang="ts">
    import { onMount } from 'svelte';

    export let value: string = '';
    export let placeholder: string = 'Enter text...';
    export let type: string = 'default';
    export let width: number = 15;
    export let inputRef: HTMLInputElement | null = null;
    export let align: string = 'left';
    export let uppercase: boolean = false;
    export let margin: number = 1;
    export let onInput: (e: InputEvent) => void = (_) => {};
    export let font = `"STIX Two Math", "Cambria Math", serif;`;

    switch(type) {
        case 'single':
            placeholder = '';
            width = 1.6;
            align = 'center';
            break;
    }

    onMount(() => {
        if(!inputRef) return;
        inputRef.addEventListener('keydown', (e) => {
            if(!inputRef) return;
            if(e.key === 'Escape')
                inputRef.blur();
        });

        inputRef.addEventListener('input', () => {
            if(uppercase)
                value = value.toUpperCase();

            switch(type) {
                case 'single':
                    if(value.length > 1)
                        value = value[value.length-1];
                    break;
            }
        });
    });
</script>

<input
    bind:this={inputRef}
    bind:value
    on:input={onInput}
    placeholder={placeholder}
    style={`
        width: ${width}rem;    
        text-align: ${align};
        margin: ${margin}rem;
        font-family: ${font};
    `}
/>

<style>
    input {
        display: flex;
        align-items: center;
        height: 3rem;
        padding: 1rem 1.5rem;
        padding-top: 1.2rem;
        border: 2px solid #444;
        background: transparent;
        color: var(--light);
        font-size: 20pt;
        outline: none;
        transition: all 0.2s ease;
    }

    input:focus {
        border-color: var(--light);
    }

    input:hover:not(:focus-visible) {
        transform: scale(1.05);
    }
</style>
