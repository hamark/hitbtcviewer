import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NoopInterceptor} from '@angular/common/http/src/interceptor';
import {AuthentificationInterceptor} from './hitbtc/auth/authentification.interceptor';
import {AuthentificationService} from './hitbtc/auth/authentification.service';
import {TradingApiService} from './hitbtc/api/trading.api';
import {GlobalInfoService} from './hitbtc/api/global-info.api';
import {Stock} from './wallet/stock';
import {WalletService} from './wallet/wallet.service';
import {DecimalPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap';
import {StockService} from "./wallet/stock.service";
import {TradesService} from "./wallet/trades.service";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AlertModule.forRoot()
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthentificationInterceptor,
    multi: true,
  },
    AuthentificationService,
    TradingApiService,
    GlobalInfoService,
    WalletService,
    TradesService,
    StockService,
    DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}
