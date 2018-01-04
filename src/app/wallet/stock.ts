import {Ticker} from '../hitbtc/model/ticker';
import {Balance} from '../hitbtc/model/balance';

export class Stock {


  currency: string;
  available: number;
  reserved: number;
  cours: Ticker;

  constructor(balance: Balance) {
    this.setBalance(balance);
  }

  public setBalance(balance: Balance) {
    this.currency = balance.currency;
    this.reserved = +balance.reserved;
    this.available = +balance.available;
  }

  total(): number {
    return this.available + this.reserved;
  }

  evolution(): number {
    if (this.cours) {
      return +this.cours.last * 100 / +this.cours.open - 100;
    } else {
      return 0;
    }
  }

  totalUSD(): number {
    if (!this.cours) {
      if(this.currency === 'USD') return this.total();
      return 0;
    }
    return this.total() * this.cours.last;
  }

}
