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

  let period: '1w' | '1m' | '6m' | 'ytd' | '1y' | '3y' = '6m';

  $: prices = data.prices.filter((p) => {
    let date = dayjs(p.date);
    let now = dayjs();
    let diff = now.diff(date, 'day');

    switch (period) {
      case '1w':
        return diff <= 7;
      case '1m':
        return diff <= 30;
      case '6m':
        return diff <= 180;
      case 'ytd':
        return date.isAfter(dayjs().startOf('year'));
      case '1y':
        return diff <= 365;
      case '3y':
        return diff <= 1095;
    }
  });

  // price list is in descending date order
  $: latestPrice = prices.length > 0 ? prices[0].close : 0;
  $: oldestPrice = prices.length > 0 ? prices[prices.length - 1].close : 0;
  $: diff = latestPrice - oldestPrice;
  $: diffPct = (diff / oldestPrice) * 100;

  $: boughtStr = '1,000';
  $: bought = boughtStr === '' ? 0 : parseInt(boughtStr.replace(',', ''));
  $: boughtAt = oldestPrice;
  $: soldAt = latestPrice;
  $: pctChg = (soldAt - boughtAt) / boughtAt;
  $: chg = bought * pctChg;
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
          <h3 class="text-3xl font-extrabold">{formatCurrency(latestPrice)}</h3>
          <h3 class="text-green-500">(+{diff.toFixed(2)}) +{diffPct.toFixed(2)}%</h3>
        {:else}
          <h3 class="text-3xl font-extrabold">{formatCurrency(latestPrice)}</h3>
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

    {#key period}
      <ChartComponent
        data={{ symbol: data.symbol, prices }}
        {diff}
        {period}
        onBuyClick={(price) => {
          boughtAt = price;
        }} />
    {/key}

    <div class="flex flex-col gap-5">
      <div class="flex flex-1 flex-col justify-start gap-3 text-xl text-stone-500">
        <p>If you bought</p>

        <div class="flex flex-row items-center gap-1">
          <p class="text-5xl">$</p>
          <input
            class="w-10/12 border-b border-b-stone-500 bg-background text-5xl text-foreground outline-none md:w-1/2"
            bind:value={boughtStr}
            on:blur={() => {
              if (boughtStr === '') {
                boughtStr = '1';
              } else {
                boughtStr = formatCurrency(parseFloat(boughtStr))
                  .replace('$', '')
                  .replace('.00', '');
              }
            }}
            on:focus={() => {
              boughtStr = boughtStr.replace(',', '');
            }} />
        </div>

        <p>
          worth of <span class="text-foreground">{data.symbol}</span> stock at
          <span class="text-foreground">{formatCurrency(boughtAt)}</span>
        </p>
      </div>

      <div class="flex flex-1 flex-col items-end gap-3 text-xl">
        <p class="text-stone-500">it would be worth</p>
        <p class="text-5xl">
          {formatCurrency(bought + chg)}
        </p>

        <div class="flex flex-row gap-3">
          <p class={pctChg > 0 ? 'text-green-500' : 'text-rose-500'}>
            ({chg > 0 ? '+' : '-'}{formatCurrency(Math.abs(chg))})
          </p>

          <p class={pctChg > 0 ? 'text-green-500' : 'text-rose-500'}>
            {pctChg > 0 ? '+' : '-'}{Math.abs(pctChg * 100).toFixed(2)}%
          </p>
        </div>

        <p class="text-stone-500">today</p>
      </div>
    </div>
  </div>
</div>
