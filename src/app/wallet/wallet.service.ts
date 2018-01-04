import {Stock} from './stock';
import {TradingService} from '../hitbtc/api/trading.api';
import {Balance} from '../hitbtc/model/balance';
import {Ticker} from '../hitbtc/model/ticker';
import {GlobalInfoService} from '../hitbtc/api/global-info.api';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import {Transaction} from '../hitbtc/model/transaction';

@Injectable()
export class WalletService {

  public wallet: Stock [] = [];

  public transactions : Transaction [];

  private updateStarted = false;

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
    this.tradingService.getTransactions().subscribe((transactions) => {
      for(let transaction of this.transactions) {
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
}
