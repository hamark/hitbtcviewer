import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Ticker} from './hitbtc/model/ticker';
import {Stock} from './wallet/stock';
import {GlobalInfoService} from './hitbtc/api/global-info.api';
import {TradingApiService} from './hitbtc/api/trading.api';
import {Balance} from './hitbtc/model/balance';
import {WalletService} from './wallet/wallet.service';
import {Transaction} from './hitbtc/model/transaction';
import {AuthentificationService} from './hitbtc/auth/authentification.service';
import {StockService} from "./wallet/stock.service";
import {TradesService} from "./wallet/trades.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'app';

  xrpValue: string;

  ownCurrencies: Stock[] = [];

  constructor(private walletService: WalletService,
              private stockService: StockService,
              private tradesService: TradesService,
              private authService: AuthentificationService) {

  }

  ngOnInit(): void {
    this.stockService.loadSymbols();
    this.walletService.loadWallet();
    this.walletService.loadInvestment();
  }



  isAuthDefined() {
    return this.authService.isAuthDefine();
  }

  get wallet() {
    return this.walletService;
  }

  get transactions(): Transaction [] {
    return this.walletService.transactions;
  }


  get apiKey() {
    return this.authService.apiKey;
  }

  get privateKey() {
    return this.authService.privateKey;
  }

  set apiKey(apiKey: string) {
    this.authService.apiKey = apiKey;
  }

  set privateKey(privateKey: string) {
    this.authService.privateKey = privateKey;
  }

  getAveragePrice(amount: number, currency: string) {
    return this.tradesService.getAverageBuyPrice(amount, currency);
  }

}
