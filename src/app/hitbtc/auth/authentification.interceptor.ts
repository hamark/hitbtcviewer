import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {AuthentificationService} from './authentification.service';

@Injectable()
export class AuthentificationInterceptor implements HttpInterceptor{

  constructor(private authService: AuthentificationService) {

  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isAuthDefine()) {
      const authReq = req.clone({setHeaders: {Authorization: this.authService.getAuthHeader()}});
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}
