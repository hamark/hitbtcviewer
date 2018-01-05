import {Stock} from './stock';
import {TradingService} from '../hitbtc/api/trading.api';
import {Balance} from '../hitbtc/model/balance';
import {Ticker} from '../hitbtc/model/ticker';
import {GlobalInfoService} from '../hitbtc/api/global-info.api';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import {Transaction} from '../hitbtc/model/transaction';
import {Candle} from '../hitbtc/model/candle';

@Injectable()
export class WalletService {

  public wallet: Stock [] = [];

  public transactions: Transaction [];

  private updateStarted = false;

  public investissement = 0;

  constructor(private tradingService: TradingService,
              private globalInfoService: GlobalInfoService) {

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
    this.globalInfoService.getCandles('ETHUSD', 100, 'D1').subscribe((ethCandles) => {
      this.getTransactions(ethCandles);
    });

  }

  private getTransactions(ethCandles: Candle[]) {
    this.tradingService.getTransactions().subscribe((transactions) => {
      // Pour l'instant on gère que l'ETH en entrée
      this.investissement = 0;
      for (let transaction of transactions) {
        if(transaction.type != "payin") continue;
        let candle = this.findCandleForTransaction(transaction, ethCandles);
        if (candle) {
          this.investissement += ((+candle.open + +candle.close) / 2) * +transaction.amount;
        }
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
    return this.totalUSD() * 100 / this.investissement;

  }

  private loadCurrentStockValue(stock: Stock) {
    this.globalInfoService.getTicker(stock.currency, 'USD')
      .subscribe((ticker: Ticker) => {
          stock.cours = ticker;
        },
        (error) => {
          this.globalInfoService.getTicker(stock.currency, 'USDT')
            .subscribe((ticker: Ticker) => {
              stock.cours = ticker;
            });
        }
      );
  }

  private findCandleForTransaction(transaction: Transaction, ethCandles: Candle[]): Candle {
    for (let candle of ethCandles) {
      if (candle.timestamp.getDate() == transaction.createdAt.getDate()
        && candle.timestamp.getMonth() == transaction.createdAt.getMonth()
        && candle.timestamp.getFullYear() == transaction.createdAt.getFullYear()) {
        return candle;
      }
    }
    return null;
  }

}
