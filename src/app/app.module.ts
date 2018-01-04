import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NoopInterceptor} from '@angular/common/http/src/interceptor';
import {AuthentificationInterceptor} from './hitbtc/auth/authentification.interceptor';
import {AuthentificationService} from './hitbtc/auth/authentification.service';
import {TradingService} from './hitbtc/api/trading.api';
import {GlobalInfoService} from './hitbtc/api/global-info.api';
import {Stock} from './wallet/stock';
import {WalletService} from './wallet/wallet.service';
import {DecimalPipe} from '@angular/common';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthentificationInterceptor,
    multi: true,
  },
    AuthentificationService,
    TradingService,
    GlobalInfoService,
    WalletService,
    DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}
