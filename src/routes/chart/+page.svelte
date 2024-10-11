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
            backgroundColor: diff > 0 ? 'hsla(142, 71%, 45%, 0.2)' : 'hsl(350, 89%, 60%, 0.2)',
            borderColor: diff > 0 ? 'hsl(142, 71%, 45%)' : 'hsl(350, 89%, 60%)',
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
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'hsl(24, 10%, 10%)',
            titleColor: '#fff',
            titleFont: {
              family: 'Arial',
              size: 14,
              weight: 'bold'
            },
            bodyColor: '#78716c',
            bodyFont: {
              family: 'Nunito',
              size: 14
            },
            cornerRadius: 4,
            // padding: 10,
            boxWidth: 0,
            boxHeight: 0,
            // Adjust padding
            padding: {
              top: 10,
              right: 12,
              bottom: 8,
              left: 12
            },
            callbacks: {
              title: function (tooltipItems) {
                return '';
              },
              label: function (tooltipItem) {
                return `${tooltipItem.formattedValue}   ${dayjs(tooltipItem.label).format('MMM D, YYYY')}`;
              },
              afterLabel: function (tooltipItem) {
                return '';
              }
            }
          }
        },
        elements: {
          point: {
            radius: 0
          }
        },
        interaction: {
          intersect: false,
          axis: 'x'
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true
            },
            ticks: {
              callback: function (val, index) {
                const date = dayjs(this.getLabels()[index]);
                return index % 3 === 0 ? date.format('MMM D') : '';
              },
              maxRotation: 0,
              minRotation: 0
            }
          },
          y: {
            display: true,
            title: {
              text: 'Value'
            }
            // suggestedMin: -10,
            // suggestedMax: 200
          }
        }
      },
      plugins: [verticalLinePlugin]
    });
  });
</script>

<div class="w-11/12 sm:w-10/12 md:w-8/12 lg:w-8/12 xl:w-8/12 2xl:w-6/12">
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
          <h3 class="text-rose-500">({diff.toFixed(2)}) {diffPct.toFixed(2)}%</h3>
        {/if}
      </div>
    </div>

    <canvas bind:this={chartCanvas} class="w-full place-self-center" />
  </div>
</div>
