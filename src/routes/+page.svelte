<script>
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Search } from 'lucide-svelte';
  import SearchComponent from '$lib/components/search.svelte';
  import tickers from '$lib/data/tickers.json';
  import { twMerge } from 'tailwind-merge';
</script>

<div class="w-11/12 sm:w-6/12 md:w-5/12 md:pt-24 lg:w-4/12 xl:w-4/12 2xl:w-3/12">
  <div class="flex flex-col gap-2 self-center p-5 font-nunito">
    <h1 class="text-center text-5xl font-extrabold tracking-tighter">if you bought...</h1>

    <div class="flex flex-row gap-3">
      <SearchComponent placeholder="search for a stock..." />

      <Button size="icon" class="p-2"><Search size={20} /></Button>
    </div>

    <div class="flex flex-row justify-center gap-1">
      <Button variant="outline" href="/chart?symbol=AAPL">AAPL</Button>
      <Button variant="outline" href="/chart?symbol=MSFT">MSFT</Button>
      <Button variant="outline" href="/chart?symbol=META">METAA</Button>
      <Button variant="outline" href="/chart?symbol=NVDA">NVDA</Button>
      <Button variant="outline" href="/chart?symbol=GOOGL">GOOGL</Button>
    </div>
  </div>
</div>
