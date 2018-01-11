import {Injectable} from '@angular/core';
import {TradingApiService} from '../hitbtc/api/trading.api';
import {Trade} from '../hitbtc/model/trades';

@Injectable()
export class TradesService {

  public trades: Trade [];

  constructor(private tradingApi: TradingApiService) {

  }


  loadTrades() {
    this.tradingApi.getTrades().subscribe((trades) => {
      this.trades = trades;
    });
  }

  getAverageBuyPrice(amount: number, currency: string) {
    const tradesOfCurrency = this.getTrades(currency);
    let totalAmount = amount;
    let buyPrice = 0;
    for(const trade of tradesOfCurrency) {
      let sign = (trade.side === 'buy') ? -1 : 1;
      totalAmount += trade.quantity * sign;
      // Ce qu'on ne doit pas prendre en compte
      let lastNoNeedAmount = 0;
      if ( totalAmount <= 0) {
        lastNoNeedAmount = totalAmount * -1;
        totalAmount = 0;
      }
      // TODO : gestion que en USD
      // TODO : Gestion multi currency
      buyPrice += (trade.quantity * trade.price - lastNoNeedAmount * trade.price);
    }
    return buyPrice / amount;
  }


  private getTrades(currency: string) {
    const tradesOfCurrency: Trade[] = [];
    for (const trade of this.trades) {
      if (trade.symbol.match('.*' + currency + '.*')) {
        tradesOfCurrency.push(trade);
      }
    }
    return tradesOfCurrency;
  }
}
