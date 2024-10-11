<script>
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Search } from 'lucide-svelte';
  import SearchComponent from '$lib/components/search.svelte';
  import tickers from '$lib/data/tickers.json';
  import { twMerge } from 'tailwind-merge';

  let search = '';
  $: filteredTickers = search
    ? tickers.filter(
        (ticker) =>
          ticker.symbol.toLowerCase().startsWith(search.toLowerCase()) ||
          ticker.name.toLowerCase().startsWith(search.toLowerCase())
      )
    : [];
</script>

<div class="w-11/12 sm:w-6/12 md:w-5/12 md:pt-24 lg:w-4/12 xl:w-4/12 2xl:w-3/12">
  <div class="font-nunito flex flex-col gap-2 self-center p-5">
    <h1 class="text-center text-5xl font-extrabold tracking-tighter">if you bought...</h1>

    <div class="flex flex-row gap-3">
      <SearchComponent placeholder="search for a stock..." />

      <Button size="icon" class="p-2"><Search size={20} /></Button>
    </div>

    <div class="flex flex-row justify-center gap-1">
      <Button variant="outline">AAPL</Button>
      <Button variant="outline">MSFT</Button>
      <Button variant="outline">META</Button>
      <Button variant="outline">NVDA</Button>
      <Button variant="outline">GOOGL</Button>
    </div>
  </div>
</div>
