export class Trade {
  id: number;
  clientOrderId: string;
  orderId: number;
  symbol: string;
  side: string; // sell, buy
  quantity: number;
  fee: string;
  price: number;
  timestamp: Date;
}
