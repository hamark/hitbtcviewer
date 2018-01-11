import {Symbol} from '../hitbtc/model/symbol';
import {Injectable} from '@angular/core';
import {GlobalInfoService} from '../hitbtc/api/global-info.api';

@Injectable()
export class StockService {

  public symbols: Symbol[];

  constructor(private globalInfoApi: GlobalInfoService) {}


  loadSymbols() {

    this.globalInfoApi.getSymbols().subscribe( (symbols) =>
      this.symbols = symbols
    );
  }

  /**
   * ETHBTC => return ETH
   */
  getBaseCurrency(symbolToFound: string): string {
    for (const symbol of this.symbols) {
      if (symbol.id === symbolToFound) {
        return symbol.baseCurrency;
      }
    }
  }

  /**
   * ETHBTC => return BTC
   */
  getQuoteCurrency(symbolToFound: string): string {
    for (const symbol of this.symbols) {
      if (symbol.id === symbolToFound) {
        return symbol.baseCurrency;
      }
    }
  }

  getUSDSymbol(currency: string) {
    for (const symbol of this.symbols) {
      if (symbol.baseCurrency === currency && (symbol.quoteCurrency === 'USD' || symbol.quoteCurrency === 'USDT')) {
        return symbol.id;
      }
    }
  }



}
