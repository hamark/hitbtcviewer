import {Symbol} from '../hitbtc/model/symbol';
import {Injectable} from '@angular/core';
import {GlobalInfoApi} from '../hitbtc/api/global-info.api';
import {TradingService} from '../hitbtc/api/trading.api';
import {Ticker} from '../hitbtc/model/ticker';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class TickerService {


  public tickers: Ticker[];

  constructor(private globalApi: GlobalInfoApi) {}

  runTickerLoad() {
    const interval = Observable.interval(3000);
    interval.subscribe(() => {
      this.loadTickers();
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



}
