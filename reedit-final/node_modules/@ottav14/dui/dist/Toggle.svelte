<script lang="ts">
    export let checked: boolean = false;
    export let margin: number = 1;
    export let onInput: (val: boolean) => void = (_) => {};

    const toggle = () => {
        checked = !checked;
        onInput(checked);
    }
</script>

<button
    class="toggle"
    class:checked
    on:click={toggle}
    aria-pressed={checked}
    style={`
        margin: ${margin}rem;
    `}
>
    <div class="thumb" />
</button>

<style>
    .toggle {
        width: 6rem;
        height: 3rem;
        border-radius: 999px;
        border: none;
        cursor: pointer;
        background: #515151;
        position: relative;
        transition: background 0.2s ease;
        padding: 0;
    }

    .toggle.checked {
        background: #4287f5;
    }

    .thumb {
        width: 3rem;
        height: 3rem;
        background: white;
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: 0;
        transition: transform 0.2s ease;
    }

    .toggle:hover .thumb {
        transform: scale(1.2);
    }

    .toggle.checked:hover .thumb {
        transform: translateX(100%) scale(1.2);
    }

    .toggle.checked .thumb {
        transform: translateX(100%);
    }
</style>
