import {Symbol} from '../hitbtc/model/symbol';
import {Injectable} from '@angular/core';
import {GlobalInfoApi} from "../hitbtc/api/global-info.api";

@Injectable()
export class StockService {

  private symbols: Symbol[];

  constructor(private globalInfoApi: GlobalInfoApi) {}


  loadSymbols() {

    this.globalInfoApi.getSymbols().subscribe( (symbols) =>
      this.symbols = symbols
    );
  }



}
