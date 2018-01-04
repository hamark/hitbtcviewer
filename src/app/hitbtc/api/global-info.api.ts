import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Ticker} from '../model/ticker';

@Injectable()
export class GlobalInfoService {

  private publicApiUrl = 'https://api.hitbtc.com/api/2/public/';

  private tikerUrl = this.publicApiUrl + 'ticker';
  private balanceUrl = this.publicApiUrl + 'ticker';


  constructor(private http: HttpClient) {}

   getTicker(currency: string, to: string): Observable<Ticker> {
      return this.http.get<Ticker>(this.tikerUrl + '/' + currency + to);
  }




}
