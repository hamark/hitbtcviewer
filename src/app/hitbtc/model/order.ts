import {TradeReport} from './tradereport';

export class Order {
  id: number;
  createdAt: string;
  clientOrderId: string;
  tradeReport: TradeReport;
  cumQuantity: string;
  stopPrice: string;
  price: number;
  quantity: number;
  expireTime: string;
  updatedAt: string;
  status: string;
  side: string;
  symbol: string;
  timeInForce: string;
  type: string;
}
