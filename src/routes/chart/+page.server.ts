import redis from '$lib/redis';
import { error, redirect, type LoadEvent } from '@sveltejs/kit';
import Redis from 'ioredis';
import { env } from '$env/dynamic/private';
import type { Stock } from '$lib/types';

export async function load(event: LoadEvent) {
  const symbol = event.url.searchParams.get('symbol');

  if (!symbol) {
    redirect(302, '/');
  }

  const stock = await redis.get(symbol);

  // TODO: latest date

  if (!stock) {
    const response = await fetch(
      `http://api.marketstack.com/v1/eod?access_key=${env.MARKETSTACK_API_KEY}&symbols=${symbol.toUpperCase()}`
    );

    if (response.ok) {
      const json = await response.json();

      if (!json.data) {
        console.log('No data');
        error(501, 'No data');
      }

      const flattened = [];
      let splitFactor = 1;

      for (const d of json.data) {
        flattened.push({
          date: d.date.substring(0, 10),
          close: d.close / splitFactor
        });

        if (d.split_factor !== 1) {
          splitFactor = d.split_factor;
        }
      }

      // TODO: pagination

      await redis.set(symbol, JSON.stringify(flattened));

      return {
        prices: flattened,
        symbol: symbol
      } as Stock;
    } else {
      error(501, response.statusText);
    }
  } else {
    return {
      prices: JSON.parse(stock),
      symbol: symbol
    } as Stock;
  }
}
