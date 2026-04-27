<script lang="ts">
    import { onMount } from 'svelte';
    import Text from './Text.svelte';

    export let text: string = '';
    export let disabled: boolean = false;
    export let leftBorder: boolean = true;
    export let rightBorder: boolean = true;
    export let topBorder: boolean = true;
    export let bottomBorder: boolean = true;
    export let border: boolean = true;
    export let icon: string = '';
    export let iconSize: number = 48;
    export let primaryColor: string = '#101010';
    export let secondaryColor: string = '#ededed';
    export let tertiaryColor: string = '#515151';
    export let margin: number = 0;
    export let width: string = 'auto';
    export let justify: string = 'center';
    export let onClick: () => void = () => {};
    export let type: string = 'default';
    export let toggleButton: boolean = false;
    export let toggle = false;

    let textColor = secondaryColor;

    switch(type) {
        case 'plus':
            text = '+';
            width = '6rem';
            break;
        case 'minus':
            text = '-';
            width = '6rem';
            break;
        case 'settings':
            width = '6rem';
            icon = 'm370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z';
            break;
    }

    let hovered = false;
    let ref: HTMLButtonElement;

    if(!border) {
        leftBorder = false;
        rightBorder = false;
        topBorder = false;
        bottomBorder = false;
    }

    $: {
        if(disabled) textColor = tertiaryColor;
        else if(hovered || toggleButton && toggle) textColor = primaryColor;
        else textColor = secondaryColor;
    }

    const handleClick = () => {
        if(toggleButton)
            toggle = !toggle;

        onClick();
    }

    onMount(() => {
        ref.addEventListener('mouseenter', () => hovered = true);
        ref.addEventListener('mouseleave', () => hovered = false);
    });
</script>

<button 
    disabled={disabled} 
    on:click={handleClick}
    bind:this={ref}
    class={toggleButton && toggle ? 'toggled' : 'notToggled'}
    style={`
        --primary: ${primaryColor};
        --secondary: ${secondaryColor};
        border-left: ${leftBorder ? `1px solid ${secondaryColor}` : 'none'};
        border-right: ${rightBorder ? `1px solid ${secondaryColor}` : 'none'};
        border-top: ${topBorder ? `1px solid ${secondaryColor}` : 'none'};
        border-bottom: ${bottomBorder ? `1px solid ${secondaryColor}` : 'none'};
        margin: ${margin}rem;
        width: ${width};
        max-width: ${width};
        justify-content: ${justify};
    `}
>
    <Text text={text} color={textColor} />
    {#if icon.length > 0}
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={`${iconSize}px`} 
            height={`${iconSize}px`} 
            viewBox="0 -960 960 960" 
            fill={secondaryColor}
            stroke={secondaryColor}
        >
            <path d={icon}/>
        </svg>
    {/if}

</button>

<style>
    button {
        display: flex;
        align-items: center;
        text-align: center;
        min-width: 6rem;
        min-height: 6rem;
        padding: 1.5rem;
        border-radius: 0;
        background-color: var(--primary, #101010);
        color: var(--secondary, #ededed);
        font-size: 24pt;
        transition: all 0.15s ease;
        cursor: pointer; 
    }

    .toggled {
        background-color: var(--secondary, #ededed);
        color: var(--primary, #101010);
        z-index: 2;
    }

    button:hover {
        background-color: var(--secondary, #ededed);
        color: var(--primary, #101010);
        transform: scale(1.1);
        z-index: 2;
    }

    button:disabled {
        background-color: var(--tertiary, #101010);
        color: var(--neutral, #424242);
        cursor: not-allowed;
        transform: scale(1);
    }

    button:active:not(:disabled) {
        transform: scale(1.15);
    }

    button:hover svg {
        fill: var(--primary);
        stroke: var(--primary);
    }
</style>
