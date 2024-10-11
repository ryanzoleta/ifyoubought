export type Stock = {
  symbol: string;
  prices: {
    date: string;
    close: number;
  }[];
};
