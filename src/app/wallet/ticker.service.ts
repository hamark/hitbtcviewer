import {Symbol} from '../hitbtc/model/symbol';
import {Injectable} from '@angular/core';
import {GlobalInfoApi} from '../hitbtc/api/global-info.api';
import {TradingService} from '../hitbtc/api/trading.api';
import {Ticker} from '../hitbtc/model/ticker';
import {Observable} from 'rxjs/Observable';
import {OrderBook} from '../hitbtc/model/order-book';

@Injectable()
export class TickerService {


  public tickers: Ticker[];

  public orderBooks: { symbol: string, orderBook: OrderBook } [] = [];

  constructor(private globalApi: GlobalInfoApi) {
  }

  runTickerLoad() {
    const interval = Observable.interval(3000);
    interval.subscribe(() => {
      //this.loadTickers();
    });
    const interval2 = Observable.interval(2000);
    interval.subscribe(() => {
      this.loadOrderBook();
    });
  }

  loadTickers() {
    this.globalApi.getTickers().subscribe((tickers) => this.tickers = tickers);
  }

  getTicker(symbol: string): Ticker {
    if (this.tickers == null) return null;
    return this.tickers.filter((ticker) => ticker.symbol === symbol).pop();
  }

  getTickersFromCurrency(currency: string) {
    if (this.tickers == null) return null;
    return this.tickers.filter((ticker) => ticker.symbol.match('.*' + currency + '.*')).pop();
  }


  private loadOrderBook() {
    // let symbols = ['DOGEUSD', 'DOGEETH', 'ETHUSD', 'MCOETH', 'MCOUSD', 'NEOUSD', 'NEOETH', 'LTCUSD', 'LTCETH', 'XMRETH', 'XMRUSD', 'NGCETH', 'NGCUSD', 'SUBUSD'];
    let symbols = ['SUBUSD'];

    for (let symbol of symbols) {

      this.globalApi.getOrderBook(symbol, 1).subscribe((orderBook) => {

          let existingOrderBook = this.getOrderBook(symbol);
          if (existingOrderBook == null) {
            this.orderBooks.push({symbol: symbol, orderBook: orderBook});
          } else {
            existingOrderBook.orderBook = orderBook;
          }
        }
      );
    }
  }

  public getOrderBook(symbol: string) {
    for (let orderBook of this.orderBooks) {
      if (orderBook.symbol === symbol) {
        return orderBook;
      }
    }
  }
}
