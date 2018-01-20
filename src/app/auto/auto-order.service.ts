import {GlobalInfoApi} from '../hitbtc/api/global-info.api';
import {Injectable} from '@angular/core';
import {TickerService} from '../wallet/ticker.service';
import {Observable} from 'rxjs/Observable';
import {validate} from 'codelyzer/walkerFactory/walkerFn';

@Injectable()
export class AutoOrders {

  private PERCENT_MIN_GAIN = 1;

  public stockDiffCalculateds: StockDiffCalculated[] = [];

  private stocksDiffs: StockDiff[] = [
    {name: 'DOGE', mainCurrency: 'USD', midleCurrency: 'ETH'},
    {name: 'MCO', mainCurrency: 'USD', midleCurrency: 'ETH'},
    {name: 'LTC', mainCurrency: 'USD', midleCurrency: 'ETH'},
    {name: 'NEO', mainCurrency: 'USD', midleCurrency: 'ETH'},
    {name: 'NGC', mainCurrency: 'USD', midleCurrency: 'ETH'},
    {name: 'XMR', mainCurrency: 'USD', midleCurrency: 'ETH'}
  ];

  constructor(private globalApiService: GlobalInfoApi,
              private tickerService: TickerService) {
  }


  loadAutoOrders() {
    const interval = Observable.interval(3000);
    interval.subscribe(() => {
      for (let stockDiff of this.stocksDiffs) {
        this.calculDifference(stockDiff);
      }
    });
  }

  calculDifference(stockDiff: StockDiff) {
    let orderBookEth = this.tickerService.getOrderBook(stockDiff.midleCurrency + stockDiff.mainCurrency);
    let orderBookXrpUsd = this.tickerService.getOrderBook(stockDiff.name + stockDiff.mainCurrency);
    let orderBookXrpEth = this.tickerService.getOrderBook(stockDiff.name + stockDiff.midleCurrency);
    if (!orderBookEth || !orderBookXrpUsd || !orderBookXrpEth) return;

    let ethDollarBuy = orderBookEth.orderBook.bid[0].price;
    let ethDollarSell = orderBookEth.orderBook.ask[0].price;

    // $ -> stock -> ETH
    let stockSellDollar = orderBookXrpUsd.orderBook.ask[0].price;
    let stockBuylEth = orderBookXrpEth.orderBook.bid[0].price;
    let stockBuyEthConverted = stockBuylEth * ethDollarSell;

    // ETH -> stock -> $
    let stockBuyDollar = orderBookXrpUsd.orderBook.bid[0].price;
    let stockSellEth = orderBookXrpEth.orderBook.ask[0].price;
    let stockSellEthConverted = stockSellEth * ethDollarBuy;


    let gain$ = (stockSellDollar * 100) / (stockBuyEthConverted) - 100;
    let gainETH = (stockSellEthConverted * 100) / (stockBuyDollar) - 100;

    this.addToDiffTable(new StockDiffCalculated(stockDiff, gain$, stockBuyDollar, stockSellEthConverted, gainETH, stockSellDollar, stockBuyEthConverted));
  }

  private addToDiffTable(stockDiffCalculated: StockDiffCalculated) {
    let exist = false;
    for (let stockDiffCal of this.stockDiffCalculateds) {
      if (stockDiffCal.stockDiff.name === stockDiffCalculated.stockDiff.name) {
        stockDiffCal.changeValues(stockDiffCalculated);
        exist = true;
      }
    }
    if (!exist) {
      this.stockDiffCalculateds.push(stockDiffCalculated);
    }

  }
}

export class StockDiff {
  name: string;
  mainCurrency: string;
  midleCurrency: string;
}

export class StockDiffCalculated {

  constructor(public stockDiff: StockDiff,
              public gain1: number,
              public toMain1: number,
              public toMiddle1: number,
              public gain2: number,
              public toMain2: number,
              public toMiddle2: number) {
  }

  public changeValues(stockDiffCal: StockDiffCalculated) {
    this.gain1 = stockDiffCal.gain1;
    this.toMain1 = stockDiffCal.toMain1;
    this.toMiddle1 = stockDiffCal.toMiddle1;
    this.gain2 = stockDiffCal.gain2;
    this.toMain2 = stockDiffCal.toMain2;
    this.toMiddle2 = stockDiffCal.toMiddle2;
  }

}
