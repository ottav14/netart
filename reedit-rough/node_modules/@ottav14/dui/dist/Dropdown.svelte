<script lang="ts">
    import Button from './Button.svelte';

    export let items: string[] = [ 'This is a dropdown.', 'This is an item.', 'So is this.', 'And this.' ];
    export let width: number = 20; 

    let open = false;

    export let onSelect: (val: string) => void = (_) => {};
    export let primaryColor: string = '#101010';
    export let secondaryColor: string = '#ededed';
    export let border: boolean = true;

    const select = (index: number) => {
        const temp = items[index];
        items[index] = items[0];
        items[0] = temp;
        open = !open;
        onSelect(items[0]);
    }
</script>

<div id="main">
    <Button
         onClick={() => select(0)}
         text={items[0]}
         icon={open ? "M480-360 280-560h400L480-360Z" : "m 380,-460 200,-200 v 400 z"}
         iconSize={48}
         primaryColor={primaryColor}
         secondaryColor={secondaryColor}
         width={`${width}rem`}
         justify="space-between"
         border={border}
         bottomBorder={!open && border}
     />
     {#if open}
         <div class="menu">
            {#each items as item, i}
                {#if i != 0}
                    <Button
                         onClick={() => select(i)}
                         text={item}
                         icon={i == 0 ? "M480-360 280-560h400L480-360Z" : ''}
                         iconSize={48}
                         primaryColor={primaryColor}
                         secondaryColor={secondaryColor}
                         width={`${width}rem`}
                         justify="space-between"
                         border={border}
                         topBorder={i == 0}
                         bottomBorder={i == items.length-1}
                     />
                {/if}
            {/each}
         </div>
     {/if}
</div>

<style>
    :root {
        --height: 5rem;
    }

    #main {
        display: inline-flex;
        position: relative;
        flex-direction: column;
        margin: 2rem;
        width: auto;
        min-height: var(--height);
    }

    .menu {
        position: absolute;
        top: 100%;
        z-index: 1;
    }
</style>
