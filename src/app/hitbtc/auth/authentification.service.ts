import {HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthentificationService {

  apikey = '';

  privateKey = '';

  authenticate(apiKey: string, privateKey: string) {
    this.apikey = apiKey;
    this.privateKey = privateKey;
  }

  getAuthHeader(): string {
    return 'Basic ' + btoa(this.apikey + ':' + this.privateKey);
  }

  isAuthDefine(): boolean {
    return this.apikey != null && this.privateKey != null;
  }

}
