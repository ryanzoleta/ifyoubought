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
  import type { Stock } from '$lib/types';

  export let data: Stock;
  export let diff: number;

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

<canvas bind:this={chartCanvas} class="w-full place-self-center" />
