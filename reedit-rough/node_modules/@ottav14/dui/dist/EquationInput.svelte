<script lang="ts">
    export let value: string = "";
    export let label: string = "Enter expression";
    export let type: string = "text";
</script>

<div class="input-group">
    <input
        bind:value
        {type}
        placeholder=" "
        class="input"
    />
    <label class="label">{label}</label>
</div>

<style>
    .input-group {
        position: relative;
        width: 280px;
        font-family: system-ui, sans-serif;
        margin: 1rem;
    }

    .input {
        height: 3rem;
        width: 100%;
        padding: 12px 10px;
        border: 2px solid #444;
        background: transparent;
        color: var(--neutral);
        font-size: 20pt;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
    }

    .input:focus {
        border-color: var(--light);
    }

    .label {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--neutral);
        pointer-events: none;
        transition: all 0.2s ease;
        font-size: 20pt;
        background: transparent;
        padding: 0 4px;
    }

    .input-group:hover {
        transform: scale(1.1);
    }
</style>
