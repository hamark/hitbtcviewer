import {HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';

const apiKeyAttribut = 'apiKey';
const privateKeyAttribut = 'privateKey';
@Injectable()
export class AuthentificationService {

  authenticate(apiKey: string, privateKey: string) {
    this.apiKey = apiKey;
    this.privateKey = privateKey;
  }

  isAuthDefined() {
    return !this.apiKey && !this.privateKey;
  }

  getAuthHeader(): string {
    return 'Basic ' + btoa(this.apiKey + ':' + this.privateKey);
  }

  isAuthDefine(): boolean {
    return this.apiKey != null && this.privateKey != null;
  }

  get privateKey() {
    return localStorage.getItem(privateKeyAttribut);
  }

  get apiKey() {
    return localStorage.getItem(apiKeyAttribut);
  }

  set apiKey(apiKey: string) {
    localStorage.setItem(apiKeyAttribut, apiKey);
  }

  set privateKey(privateKey: string) {
    localStorage.setItem(privateKeyAttribut, privateKey);
  }

}
