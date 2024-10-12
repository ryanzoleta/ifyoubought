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
  import ChartAnnotation from 'chartjs-plugin-annotation';

  Chart.register(ChartAnnotation);

  export let data: Stock;
  export let diff: number;
  export let onBuyClick: (price: number) => void;

  let ctx;
  let chartCanvas: HTMLCanvasElement;
  let verticalLine = null;

  onMount(() => {
    ctx = chartCanvas.getContext('2d');

    if (!ctx) {
      return;
    }

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
          annotation: {
            annotations: {
              vertical: []
            }
          },

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
            displayColors: false,
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
                return 'click to "buy here"';
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
        },
        onClick: (event, elements, chart) => {
          if (elements.length > 0) {
            const firstElement = elements[0];
            // Handle the click event here
            onBuyClick(chart.data.datasets[0].data[firstElement.index] as number);

            if (elements.length > 0) {
              const firstElement = elements[0];
              const dataIndex = firstElement.index;
              const xValue = chart.data.labels[dataIndex];

              // Remove existing vertical line if any
              if (verticalLine) {
                chart.options.plugins.annotation.annotations.line1 = null;
              }

              // Add new vertical line
              verticalLine = {
                type: 'line',
                xMin: xValue,
                xMax: xValue,
                borderColor: '#0ea5e9',
                borderWidth: 2
              };

              chart.options.plugins.annotation.annotations.line1 = verticalLine;
            } else {
              // Click outside data points, clear the vertical line
              if (verticalLine) {
                chart.options.plugins.annotation.annotations.line1 = null;
                verticalLine = null;
              }
            }

            chart.update();
          }
        }
      },
      plugins: [verticalLinePlugin, ChartAnnotation]
    });
  });
</script>

<canvas bind:this={chartCanvas} class="w-full place-self-center" />
