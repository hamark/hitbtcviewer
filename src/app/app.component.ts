import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Ticker} from './hitbtc/model/ticker';
import {Stock} from './wallet/stock';
import {GlobalInfoApi} from './hitbtc/api/global-info.api';
import {TradingService} from './hitbtc/api/trading.api';
import {Balance} from './hitbtc/model/balance';
import {WalletService} from './wallet/wallet.service';
import {Transaction} from './hitbtc/model/transaction';
import {AuthentificationService} from './hitbtc/auth/authentification.service';
import {TickerService} from "./wallet/ticker.service";
import {AutoOrders} from './auto/auto-order.service';
import {MinMaxAutoOrder} from './auto/minmac.auto';

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
              private authService: AuthentificationService,
              private tickerService: TickerService,
              private autoOrder: AutoOrders,
              private minMaxAutoOrder: MinMaxAutoOrder) {

  }

  ngOnInit(): void {

    this.tickerService.runTickerLoad();
    // this.walletService.loadWallet();
    // this.walletService.loadInvestment();
    // this.autoOrder.loadAutoOrders();
    // this.minMaxAutoOrder.loadAutoOrders();
    this.minMaxAutoOrder.runAutoOrder();
    this.minMaxAutoOrder.refreshorder();
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

  get buyOrder() {
    return this.minMaxAutoOrder.buyOrder;
  }

  get sellOrder() {
    return this.minMaxAutoOrder.sellOrder;
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


  get diffStocks() {
    return this.minMaxAutoOrder.askBidDiff;
  }

  runOrders() {
    this.minMaxAutoOrder.runAutoOrder();
  }
}
