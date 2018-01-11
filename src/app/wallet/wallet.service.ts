import {Stock} from './stock';
import {TradingService} from '../hitbtc/api/trading.api';
import {Balance} from '../hitbtc/model/balance';
import {Ticker} from '../hitbtc/model/ticker';
import {GlobalInfoApi} from '../hitbtc/api/global-info.api';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import {Transaction} from '../hitbtc/model/transaction';
import {Candle} from '../hitbtc/model/candle';
import {TickerService} from './ticker.service';

@Injectable()
export class WalletService {

  public currencySymbol: { currency: string, symbol: string } [] =
    [
      {currency: 'ETH', symbol: 'ETHUSD'},
      {currency: 'BTC', symbol: 'BTCUSD'}
    ];

  public globalConversion: { currency: string, convertCurrency: string } [] =
    [
      {currency: 'USD', convertCurrency: ''},
      {currency: 'USDT', convertCurrency: ''},
      {currency: 'BTC', convertCurrency: 'USD'},
      {currency: 'ETH', convertCurrency: 'USD'},
    ];

  public currencyConversion: { currency: string, convertCurrency: string } [] = [];

  public wallet: Stock [] = [];

  public transactions: Transaction [];

  public cours: Map<string, Candle[]> = new Map<string, Candle[]>();

  private updateStarted = false;

  public investissement = 0;

  constructor(private tradingService: TradingService,
              private tickerService: TickerService,
              private globalInfoService: GlobalInfoApi) {

  }

  loadWallet() {
    this.tradingService.getBalance()
      .subscribe((balances: Balance[]) => {
          for (const balance of balances) {
            if (balance.available > 0 || balance.reserved > 0) {
              const stock = new Stock(balance);
              this.loadCurrentStockValue(stock);
              this.wallet.push(stock);
            }
          }
        }
      );
    const interval = Observable.interval(3000);

    interval.subscribe(() => {
      if (!this.updateStarted) {
        this.updateStarted = true;
        for (const stock of this.wallet) {
          this.loadCurrentStockValue(stock);
        }
        this.updateStarted = false;

      }
    });
  }

  loadInvestment() {
    this.tradingService.getTransactions().subscribe((transactions) => {
      this.transactions = transactions;
      this.investissement = 0;
      for (const transaction of this.transactions) {
        if (transaction.type != 'payin') continue;
        const symbol = this.getSymbol(transaction.currency);
        this.globalInfoService.getCandles(symbol, 100, 'D1').subscribe((candles) => {
          const candle = this.findCandleForTransaction(transaction, candles);
          if (candle) {
            this.investissement += ((+candle.open + +candle.close) / 2) * +transaction.amount;
          }
        });
      }
    });
  }


  totalUSD() {
    let total = 0;
    for (const stock of this.wallet) {
      total += stock.totalUSD();
    }
    return total;
  }

  totalTaux(): number {
    if (this.investissement == 0) return 0;
    return this.totalUSD() * 100 / this.investissement - 100;
  }

  totalGain(): number {
    return this.totalUSD() - this.investissement;
  }

  private loadCurrentStockValue(stock: Stock) {
      if (stock.currency === 'USD') return;
      this.getTickerForGlobalConversion(stock, 0);
  }



  private findCandleForTransaction(transaction: Transaction, ethCandles: Candle[]): Candle {
    for (const candle of ethCandles) {
      if (candle.timestamp.getDate() == transaction.createdAt.getDate()
        && candle.timestamp.getMonth() == transaction.createdAt.getMonth()
        && candle.timestamp.getFullYear() == transaction.createdAt.getFullYear()) {
        return candle;
      }
    }
    return null;
  }

  private getSymbol(currency: string) {
    for (const cs of this.currencySymbol) {
      if (cs.currency === currency) {
        return cs.symbol;
      }
    }
    console.error('Currency ' + currency + ' not found');
  }

  private getTickerForGlobalConversion(stock: Stock, index: number) {
    if (this.globalConversion.length <= index) return null;

    const ticker: Ticker = this.tickerService.getTicker(stock.currency + this.globalConversion[index].currency);
    if (ticker == null && this.globalConversion.length > index) return this.getTickerForGlobalConversion(stock, index + 1);

    stock.cours = ticker;
    if (this.globalConversion[index].convertCurrency !== '') {
      const convertTicker = this.tickerService.getTicker(this.globalConversion[index].currency + this.globalConversion[index].convertCurrency);
      stock.coursUsd = convertTicker;
    }
  }
}
