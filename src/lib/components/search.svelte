<script lang="ts">
  import tickers from '$lib/data/tickers.json';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { twMerge } from 'tailwind-merge';

  export let placeholder;
  export let autofocus: boolean = false;

  let search = '';
  $: filteredTickers = search
    ? tickers.filter(
        (ticker) =>
          ticker.symbol.toLowerCase().startsWith(search.toLowerCase()) ||
          ticker.name.toLowerCase().startsWith(search.toLowerCase())
      )
    : [];
</script>

<div class="relative flex-1">
  <Input {placeholder} bind:value={search} />

  {#if filteredTickers.length > 0}
    <div class="bg-background absolute left-0 top-10 w-full rounded-xl border p-2">
      {#each filteredTickers as t, index}
        <a
          href="/chart?symbol={t.symbol}"
          data-sveltekit-reload
          class={twMerge(
            'flex w-full flex-col px-3 py-5 text-left hover:opacity-50',
            index === filteredTickers.length - 1 ? '' : 'border-b'
          )}>
          <p class="text-lg font-bold">{t.symbol}</p>
          <p class="text-muted-foreground">{t.name}</p>
        </a>
      {/each}
    </div>
  {/if}
</div>
