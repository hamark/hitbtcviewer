import {GlobalInfoApi} from '../hitbtc/api/global-info.api';
import {TickerService} from '../wallet/ticker.service';
import {Injectable} from '@angular/core';
import {StockDiff, StockDiffCalculated} from './auto-order.service';
import {OrderBook} from '../hitbtc/model/order-book';
import {Observable} from 'rxjs/Observable';
import {TradingService} from '../hitbtc/api/trading.api';
import {Order} from '../hitbtc/model/order';

@Injectable()
export class MinMaxAutoOrder {

  public askBidDiff : { symbol: string, diff : number} [] = [];

  public lock: boolean = false;

  private stocksDiffs: StockDiff[] = [
    {name: 'DOGE', mainCurrency: 'USD', midleCurrency: 'ETH'},
    {name: 'MCO', mainCurrency: 'USD', midleCurrency: 'ETH'},
    {name: 'LTC', mainCurrency: 'USD', midleCurrency: 'ETH'},
    {name: 'NEO', mainCurrency: 'USD', midleCurrency: 'ETH'},
    {name: 'NGC', mainCurrency: 'USD', midleCurrency: 'ETH'},
    {name: 'XMR', mainCurrency: 'USD', midleCurrency: 'ETH'},
    {name: 'SUB', mainCurrency: 'USD', midleCurrency: 'ETH'}
  ];


  buyOrder : Order;
  sellOrder : Order;

  constructor(private globalApiService: GlobalInfoApi,
              private tradingApiService: TradingService,
              private tickerService: TickerService) {
  }

  loadAutoOrders() {
    const interval = Observable.interval(3000);
    interval.subscribe(() => {
      if(!this.lock) {
        this.lock = true;
        this.askBidDiff = [];
        for (let stockDiff of this.stocksDiffs) {
          this.calculDifference(stockDiff);
        }
        this.lock = false;
      }
    });
  }

  private calculDifference(stockDiff: StockDiff) {
    let symbol = stockDiff.name + stockDiff.mainCurrency;
    let orderBook = this.tickerService.getOrderBook(symbol);
    if(orderBook == null) {
      console.log("Order book " + symbol + " empty");
      return;
    }
    let firstAskPrice = orderBook.orderBook.ask[0].price;
    let firstSellPrice = orderBook.orderBook.bid[0].price;
    let diff = firstAskPrice - firstSellPrice;
    let percent = (diff * 100 / firstAskPrice);

    this.askBidDiff.push({symbol: orderBook.symbol, diff:  percent});
  }

  refreshorder() {
    const interval = Observable.interval(3000);
    interval.subscribe(() => {
      if(this.buyOrder != null) {
        this.tradingApiService.getOrder(this.buyOrder).subscribe((order) => {
            this.buyOrder = order;
          }
        );
      }
      if(this.sellOrder != null) {
        this.tradingApiService.getOrder(this.sellOrder).subscribe((order) => {
          this.sellOrder = order;
        });
      }
    });
  }

  runAutoOrder() {
    let symbol = "SUBUSD";
    let orderBook = this.tickerService.getOrderBook(symbol);
    let firstBuyPrice = +orderBook.orderBook.bid[0].price;
    let firstSellPrice = +orderBook.orderBook.ask[0].price;
    let buyPrice = firstBuyPrice + 0.001;
    let sellPrice =  firstSellPrice - 0.001;
    let diffPercent = ((sellPrice - buyPrice) * 100) / buyPrice;
    if(diffPercent > 2) {
      // addOrders
      if(this.buyOrder == null || this.buyOrder.status == "filled") {
        let orderBuy: Order = this.createBuyOrder(symbol, buyPrice);
        this.tradingApiService.addOrder(orderBuy).subscribe((order) => {
          this.buyOrder = order;
        });
      } else {
        if(this.buyOrder.price < firstBuyPrice) {
          let orderBuy: Order = this.createBuyOrder(symbol, buyPrice);
          this.tradingApiService.replaceOrder(this.buyOrder, orderBuy).subscribe((order) => {
            this.buyOrder = order;
          })
        }
      }

      if(this.sellOrder == null || this.sellOrder.status == "filled") {
        let orderSell: Order = this.createSellOrder(symbol, sellPrice);
        this.tradingApiService.addOrder(orderSell).subscribe((order) => {
          this.buyOrder = order;
        });
      }  else {
        if(this.sellOrder.price > firstSellPrice) {
          let orderSell: Order = this.createSellOrder(symbol, sellPrice);
          this.tradingApiService.replaceOrder(this.sellOrder, orderSell).subscribe((order) => {
            this.sellOrder = order;
          })
        }
      }
    } else {
      this.tradingApiService.deleteOrder(this.buyOrder);
      this.buyOrder.status = "deleted";
      this.tradingApiService.deleteOrder(this.sellOrder);
      this.sellOrder.status = "deleted";
    }
  }


  private createBuyOrder(symbol: string, price: number) {
    let order = new Order();
    order.side = "buy";
    order.quantity = 0.5;
    order.symbol = symbol;
    order.price = price;
    return order;
  }

  private createSellOrder(symbol: string, price: number) {
    let order = new Order();
    order.side = "sell";
    order.quantity = 0.5;
    order.symbol = symbol;
    order.price = price;
    return order;
  }
}
