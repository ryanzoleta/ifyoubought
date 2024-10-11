<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Search } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import tickers from '$lib/data/tickers.json';
  import SearchComponent from '$lib/components/search.svelte';
  import { browser } from '$app/environment';
  import Chart from 'chart.js/auto';

  export let data;

  let ticker = tickers.find((t) => t.symbol.toLowerCase() === data.symbol.toLowerCase());

  // price list is in descending date order
  let latestPrice = data.prices.length > 0 ? data.prices[0].close : 0;
  let oldestPrice = data.prices.length > 0 ? data.prices[data.prices.length - 1].close : 0;
  let diff = latestPrice - oldestPrice;
  let diffPct = (diff / oldestPrice) * 100;

  let ctx;
  let chartCanvas: HTMLCanvasElement;

  onMount(() => {
    ctx = chartCanvas.getContext('2d');

    if (!ctx) {
      return;
    }

    console.log('data', data);

    if (!data) return;

    let chartLabels = data.prices.map((p) => p.date).reverse();
    let chartValues = data.prices.map((p) => p.close).reverse();

    let chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: '',
            backgroundColor: 'hsla(142, 71%, 45%, 0.2)',
            borderColor: 'hsl(142, 71%, 45%)',
            fill: {
              target: 'origin'
            },
            data: chartValues
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        },
        elements: {
          point: {
            radius: 0
          }
        },
        interaction: {
          intersect: false
          // axis: 'xy'
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true
            },
            ticks: {
              callback: function (val, index) {
                // Show every 2nd label (adjust the number to change the interval)
                return index % 2 === 0 ? this.getLabelForValue(val as number) : '';
              }
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Value'
            }
            // suggestedMin: -10,
            // suggestedMax: 200
          }
        }
      }
    });
  });
</script>

<div class="w-11/12 sm:w-8/12 md:w-6/12 lg:w-6/12 xl:w-6/12 2xl:w-4/12">
  <div class="flex flex-col gap-2 self-center p-5 font-nunito">
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
          <h3 class="text-green-500">(+{diff.toFixed(2)}) +{diffPct.toFixed(2)}%</h3>
        {:else}
          <h3 class="text-3xl font-extrabold">${latestPrice}</h3>
          <h3 class="text-red-500">({diff.toFixed(2)}) {diffPct.toFixed(2)}%</h3>
        {/if}
      </div>
    </div>

    <canvas bind:this={chartCanvas} class="max-h-96 w-full place-self-center" />
  </div>
</div>
