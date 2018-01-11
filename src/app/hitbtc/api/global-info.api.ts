import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Ticker} from '../model/ticker';
import {Candle} from '../model/candle';
import {map} from 'rxjs/operators';
import {hitBtcUrlApi} from '../../../environments/environment';
import {Symbol} from '../model/symbol';

@Injectable()
export class GlobalInfoApi {

  private publicApiUrl = hitBtcUrlApi + '/public/';

  private tikerUrl = this.publicApiUrl + 'ticker';
  private candleUrl = this.publicApiUrl + 'candles';
  private symbolUrl = this.publicApiUrl + 'symbol';


  constructor(private http: HttpClient) {
  }

  getTicker(currency: string, to: string): Observable<Ticker> {
    return this.http.get<Ticker>(this.tikerUrl + '/' + currency + to);
  }

  getCandles(symbol: string, limit: number, period: string) : Observable<Candle[]>{
    return this.http.get<Candle[]>(`${this.candleUrl}/${symbol}?limit=${limit}&period=${period}`)
      .pipe(map((candlesRecup) => {
        let candles : Candle[] = [];
        for(let candle of candlesRecup) {
          candles.push(new Candle(candle));
        }
        return candles;
      }));
  }

  getSymbols(): Observable<Symbol[]> {
    return this.http.get<Symbol[]>(this.symbolUrl);
  }


  getTickers(): Observable<Ticker[]> {
    return this.http.get<Ticker[]>(this.tikerUrl);
  }
}
