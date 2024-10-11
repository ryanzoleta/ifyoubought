<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Search } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import tickers from '$lib/data/tickers.json';
  import SearchComponent from '$lib/components/search.svelte';
  import { browser } from '$app/environment';
  import Chart from 'chart.js/auto';
  import { verticalLinePlugin } from '$lib/chart-utils.js';
  import dayjs from 'dayjs';
  import ChartComponent from '$lib/components/chart.svelte';
  import { formatCurrency } from '$lib/utils';

  export let data;

  let ticker = tickers.find((t) => t.symbol.toLowerCase() === data.symbol.toLowerCase());

  // price list is in descending date order
  let latestPrice = data.prices.length > 0 ? data.prices[0].close : 0;
  let oldestPrice = data.prices.length > 0 ? data.prices[data.prices.length - 1].close : 0;
  let diff = latestPrice - oldestPrice;
  let diffPct = (diff / oldestPrice) * 100;

  let period: '1w' | '1m' | '6m' | 'ytd' | '1y' | '3y' = '1m';

  let boughtStr = '1';
  $: bought = parseInt(boughtStr);
  let boughtAt = 128.5;
  let soldAt = 162.08;
  let pctChg = (soldAt - boughtAt) / boughtAt;
</script>

<div class="w-11/12 sm:w-10/12 md:w-8/12 lg:w-8/12 xl:w-8/12 2xl:w-6/12">
  <div class="flex flex-col gap-5 self-center p-5 font-nunito">
    <div class="flex flex-row gap-3">
      <SearchComponent placeholder="search for another stock..." autofocus={false} />
      <Button variant="ghost" size="icon" class="p-2text-stone-600"><Search size={20} /></Button>
    </div>

    <div class="flex flex-row justify-between">
      <div>
        <h2 class="text-3xl font-extrabold">{ticker?.symbol}</h2>
        <h3 class="font-light text-stone-400">{ticker?.name}</h3>
      </div>

      <div class="flex flex-col items-end">
        {#if diff > 0}
          <h3 class="text-3xl font-extrabold">${formatCurrency(latestPrice)}</h3>
          <h3 class="text-green-500">(+{diff.toFixed(2)}) +{diffPct.toFixed(2)}%</h3>
        {:else}
          <h3 class="text-3xl font-extrabold">${latestPrice}</h3>
          <h3 class="text-rose-500">({diff.toFixed(2)}) {diffPct.toFixed(2)}%</h3>
        {/if}
      </div>
    </div>

    <div class="flex flex-row justify-end gap-1">
      {#each ['1w', '1m', '6m', 'ytd', '1y', '3y'] as p}
        <Button
          variant="ghost"
          class={period === p ? 'bg-stone-800' : ''}
          on:click={() => {
            //@ts-ignore
            period = p;
          }}>{p}</Button>
      {/each}
    </div>

    <ChartComponent {data} {diff} />

    <div>
      <div class="flex flex-col gap-10">
        <div class="flex flex-row items-center gap-1 self-center text-xl">
          <p>If you bought</p>
          <input
            class="w-24 border-b border-b-rose-500 bg-background text-center text-5xl"
            bind:value={boughtStr} />
          <p>
            shares of {data.symbol} at
            <span class="font-bold">{formatCurrency(boughtAt)}</span>
          </p>
        </div>

        <div class="flex flex-row justify-between text-lg">
          <div class="flex flex-col items-start">
            <p class="text-stone-500">your investment of</p>
            <p class="text-5xl">{formatCurrency(bought * boughtAt)}</p>
          </div>

          <div class="flex flex-col items-end">
            <p class="text-stone-500">would have grown {(pctChg * 100).toFixed(2)}%</p>
            <p class="text-5xl text-rose-500">
              {formatCurrency(bought * boughtAt + bought * boughtAt * pctChg)}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
