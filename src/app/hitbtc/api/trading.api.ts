import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Ticker} from '../model/ticker';
import {Observable} from 'rxjs/Observable';
import {Balance} from '../model/balance';
import {Transaction} from '../model/transaction';
import {map} from 'rxjs/operators';
import {Candle} from '../model/candle';
import {hitBtcUrlApi} from '../../../environments/environment';

@Injectable()
export class TradingService {

  private balanceUrl = hitBtcUrlApi + '/trading/balance';
  private transactionsUrl = hitBtcUrlApi + '/account/transactions';


  constructor(private http: HttpClient) {}

  getBalance(): Observable<Balance[]> {
    return this.http.get<Balance[]>(this.balanceUrl);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.transactionsUrl).pipe(map((transactionsRecup) => {
      let transactions : Transaction[] = [];
      for(let transaction of transactionsRecup) {
        transactions.push(new Transaction(transaction));
      }
      return transactions;
    }));;
  }
}
