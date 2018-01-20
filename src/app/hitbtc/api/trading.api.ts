import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Ticker} from '../model/ticker';
import {Observable} from 'rxjs/Observable';
import {Balance} from '../model/balance';
import {Transaction} from '../model/transaction';
import {map} from 'rxjs/operators';
import {Candle} from '../model/candle';
import {hitBtcUrlApi} from '../../../environments/environment';
import {Order} from '../model/order';

@Injectable()
export class TradingService {

  private balanceUrl = hitBtcUrlApi + '/trading/balance';
  private transactionsUrl = hitBtcUrlApi + '/account/transactions';
  private orderUrl = hitBtcUrlApi + '/account/order';


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

  getOrder(order: Order): Observable<Order> {
    if(order == null) return null;
    return Observable.create((suscriber) => {
      order.id = 1;
      order.status = ((Math.random() % 10) == 3) ? "filled" : "active";
      suscriber.next(order);
    })
    // return this.http.get<Order>(this.transactionsUrl + "/" + order.id);
  }

  addOrder(order: Order): Observable<Order> {

    return Observable.create((suscriber) => {
      order.id = 1;
      suscriber.next(order);
    })
  //  return this.http.post<Order>(this.transactionsUrl, order);
  }

  replaceOrder(order: Order, newOrder: Order): Observable<Order> {
    return Observable.create((suscriber) => {
      newOrder.id = 1;
      suscriber.next(newOrder);
    })
   // return this.http.post<Order>(this.transactionsUrl + "/" + order.id, newOrder);
  }

  deleteOrder(order: Order): Observable<string> {
    return Observable.create((suscriber) => {
      suscriber.next("ok");
    })
   // return this.http.delete<string>(this.orderUrl + "/" + order.id );
  }
}
