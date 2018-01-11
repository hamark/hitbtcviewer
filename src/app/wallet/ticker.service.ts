import {Symbol} from '../hitbtc/model/symbol';
import {Injectable} from '@angular/core';
import {GlobalInfoApi} from '../hitbtc/api/global-info.api';
import {TradingService} from '../hitbtc/api/trading.api';
import {Ticker} from '../hitbtc/model/ticker';

@Injectable()
export class TickerService {


  public tickers: Ticker[];

  constructor(private globalApi: GlobalInfoApi) {}

  loadTickers() {
    this.globalApi.getTickers().subscribe((tickers) => this.tickers = tickers);
  }

  getTicker(symbol: string) {
    return this.tickers.filter((ticker) => ticker.symbol === symbol).pop();
  }

  getTickersFromCurrency(currency: string) {
    return this.tickers.filter((ticker) => ticker.symbol.match('.*' + currency + '.*')).pop();
  }


}
