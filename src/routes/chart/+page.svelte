<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Search } from 'lucide-svelte';
</script>

<div class="w-11/12 sm:w-8/12 md:w-6/12 lg:w-6/12 xl:w-6/12 2xl:w-4/12">
  <div class="font-nunito flex flex-col gap-2 self-center p-5">
    <div class="flex flex-row gap-3">
      <Input placeholder="search another stock..." class="border-0" />
      <Button variant="ghost" size="icon" class="p-2 text-stone-600"><Search size={20} /></Button>
    </div>

    <div class="flex flex-row justify-between">
      <div>
        <h2 class="text-3xl font-extrabold">NVDA</h2>
        <h3 class="font-light text-stone-400">NVIDIA Corp.</h3>
      </div>

      <div class="flex flex-col items-end">
        <h3 class="text-3xl font-extrabold">$284</h3>
        <h3 class="text-green-500">(+182.23) +43.87%</h3>
      </div>
    </div>
  </div>
</div>
