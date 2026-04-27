<script lang="ts">
    import Text from './Text.svelte';
    import Button from './Button.svelte';

    export let onChange: (value: number) => void = (_) => {};

    export let min: number = 0;
    export let max: number = 10;
    export let value: number = 0;

    export const shiftValue = (delta: number) => {
        if(value + delta <= max && value + delta >= min) {
            value += delta;
            onChange(value);
        }
        else if(value < min) value = min;
        else if (value > max) value = max;
        
        return value;
    }

</script>

<div id="main">
    <div id="textContainer">
        <Text 
             text={`N : ${value}`} 
             align="center"
         />
    </div>
    <Button 
        disabled={value == max}
        onClick={() => shiftValue(1)}
        type="plus"
        rightBorder={false}
        topBorder={false}
        bottomBorder={false}
    />
    <Button 
        disabled={value == min}
        onClick={() => shiftValue(-1)}
        type="minus"
        rightBorder={false}
        topBorder={false}
        bottomBorder={false}
    />
</div>

<style>
    #main {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: #101010;
        border: 1px solid #ededed;
        margin: 2rem;
        height: 6rem;
        width: fit-content;
    }

    #textContainer {
        padding-left: 2rem;
        padding-right: 2rem;
    }
</style>
