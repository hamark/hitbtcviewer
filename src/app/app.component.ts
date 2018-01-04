import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Ticker} from './hitbtc/model/ticker';
import {Stock} from './wallet/stock';
import {GlobalInfoService} from './hitbtc/api/global-info.api';
import {TradingService} from './hitbtc/api/trading.api';
import {Balance} from './hitbtc/model/balance';
import {WalletService} from './wallet/wallet.service';
import {Transaction} from './hitbtc/model/transaction';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'app';

  xrpValue: string;

  ownCurrencies: Stock[] = [];

  constructor(private walletService: WalletService) {

  }

  ngOnInit(): void {

    this.walletService.loadWallet();
    this.walletService.loadInvestment();
  }

  get wallet() {
    return this.walletService.wallet;
  }

  get transactions(): Transaction [] {
    return this.walletService.transactions;
  }

  get walletTotal() {
    return this.walletService.totalUSD();
  }


}
