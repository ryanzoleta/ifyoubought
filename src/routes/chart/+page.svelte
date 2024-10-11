<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Search } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import tickers from '$lib/data/tickers.json';
  import SearchComponent from '$lib/components/search.svelte';

  export let data;

  let ticker = tickers.find((t) => t.symbol.toLowerCase() === data.symbol.toLowerCase());

  // price list is in descending date order
  let latestPrice = data.prices[0].close;
  let diff = data.prices[0].close - data.prices[data.prices.length - 1].close;
  let diffPct = (diff / data.prices[data.prices.length - 1].close) * 100;
</script>

<div class="w-11/12 sm:w-8/12 md:w-6/12 lg:w-6/12 xl:w-6/12 2xl:w-4/12">
  <div class="font-nunito flex flex-col gap-2 self-center p-5">
    <div class="flex flex-row gap-3">
      <SearchComponent placeholder="search for another stock..." autofocus={false} />
      <Button variant="ghost" size="icon" class="p-2 text-stone-600"><Search size={20} /></Button>
    </div>

    <div class="flex flex-row justify-between">
      <div>
        <h2 class="text-3xl font-extrabold">{ticker?.symbol}</h2>
        <h3 class="font-light text-stone-400">{ticker?.name}</h3>
      </div>

      <div class="flex flex-col items-end">
        {#if diff > 0}
          <h3 class="text-3xl font-extrabold">${latestPrice}</h3>
          <h3 class="text-green-500">(+{diff}) +{diffPct.toFixed(2)}%</h3>
        {:else}
          <h3 class="text-3xl font-extrabold">${latestPrice}</h3>
          <h3 class="text-red-500">({diff}) {diffPct.toFixed(2)}%</h3>
        {/if}
      </div>
    </div>
  </div>
</div>
