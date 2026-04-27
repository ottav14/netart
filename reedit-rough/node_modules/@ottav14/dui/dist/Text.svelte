<script lang="ts">
    export let text: string = 'Placeholder text.';
    export let width: string = 'auto';
    export let height: string = 'auto';
    export let align: string = 'flex-start';
    export let color: string = '#ededed';
    export let fontSize: number = 24;
    export let padding: number = 0;
    export let italic: boolean = false;
    export let bold: boolean = false;
    export let border: boolean = false;
    export let type: string = 'default';
    export let speed: number = 5;

    switch(type) {
        case 'h1':
            align = 'center';
            fontSize = 64;
            break;
        case 'h2':
            fontSize = 32;
            padding = 1;
            break;
    }

    $: tokens = buildTokens(text);

    let charCount = 1;

    type Char = {
        char: string;
        isSpace: boolean;
        index: number;
    };

    const buildTokens = (str: string) => {
        const raw = str.split(/(\s+)/);
        let globalIndex = 0;

        return raw.map((token) => {
            if (token.trim() === "") {
                return {
                    isSpace: true,
                    chars: [{ char: token, isSpace: true, index: -1 }]
                };
            }

            const chars: Char[] = token.split("").map((c) => {
                const obj = {
                    char: c,
                    isSpace: false,
                    index: globalIndex
                };
                globalIndex++;
                return obj;
            });

            charCount = globalIndex;

            return {
                isSpace: false,
                chars
            };
        });
    }
</script>

<span>
    {#key text}
    <div 
        class="text" 
        style={`
            width: ${width}; 
            height: ${height}; 
            justify-content: ${align}; 
            font-size: ${fontSize}pt;
            font-style: ${italic ? 'italic' : 'normal'};
            font-weight: ${bold ? 'bold' : 'normal'};
            color: ${color};
            padding: ${padding}rem;
            border: ${border ? '1px solid ' + color : 'none' };
        `}
    >
            {#each tokens as token, i (i)}
                {#if token.isSpace}
                    <span class="space">{token.chars[0].char}</span>
                {:else}
                    <span class="word">
                        {#each token.chars as c (`${i}-${c.index}`)}
                            <span
                                class="char"
                                style={`
                                    animation-delay: ${c.index / (speed*charCount)}s;
                                `}
                            >
                                {c.char}
                            </span>
                        {/each}
                    </span>
                {/if}
            {/each}
        </div>
    {/key}
</span>

<style>
    :root {
        --animation-distance: 5rem;
    }

    .text {
        font-family: "STIX Two Math", "Cambria Math", serif;
        display: flex;
        flex-wrap: wrap;
    }

    .char {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        opacity: 0;
        animation: enter 1s ease forwards;
        transform: all 0.15s ease;
        margin-top: 0.5rem;
    }

    .space {
        height: 100%;
        width: 0.3rem;
    }

    @keyframes enter {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
</style>
