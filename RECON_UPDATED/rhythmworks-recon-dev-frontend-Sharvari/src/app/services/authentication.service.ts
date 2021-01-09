import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import * as jwtDecode from 'jwt-decode';
import * as moment from 'moment';
import{ GlobalConstants } from 'src/app/global/global-constants';
import express, {Request, Response} from 'express';

@Injectable()
export class AuthService {

  //private apiRoot = 'http://localhost:8000/auth/';
  private apiRoot = GlobalConstants.authbaseUrl;
  
  code_token = null;
  username: string;
  password: string;

  constructor(private http: HttpClient) { }

  getCodeToken(): string {
    return this.code_token; 
  }

  //After credentials provided are correct
  private setSession(authResult) {
    console.log("In setSession");
    console.log(authResult);
    const token = authResult.token;
    console.log("authResult==   " + token);
    const payload = <JWTPayload>jwtDecode(token);
    console.log("authResult==   " + payload);
    const expiresAt = moment.unix(payload.exp);
    localStorage.setItem('token', token);
    localStorage.setItem('APPLICATION_ID', payload.APPLICATION_ID);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem('SUB_APPLICATION_ID', payload.SUB_APPLICATION_ID);
    localStorage.setItem('USER_ID', payload.ID.toString());
    localStorage.setItem('COMPANY_ID', payload.COMPANY_ID);
    localStorage.setItem('USER_NAME', payload.username);
    localStorage.setItem('EMAIL_ID', payload.email.toString());
    console.log("localStorage====" + localStorage);

  }

  //Checking session
  get token(): string {
    return localStorage.getItem('token');
  }

  setCodeToken(token){
    this.code_token = token;
  }

  resendCode(){
    return this.http.post(
      this.apiRoot.concat('code/'),
      { username : this.username, password : this.password}
    )
  }

  code(username: string, password: string){
    this.username = username;
    this.password = password;
    return this.http.post(
      this.apiRoot.concat('code/'),
      { username, password}
    )
  }

  login(code_token: string, code: string) {
    return this.http.post(
      this.apiRoot.concat('login/'),
      { code_token, code }
    ).pipe(
      tap(response => {
        this.setSession(response);
        this.username = null;
        this.password = null;
      }),
      shareReplay(),
    );
  }

  signup(username: string, email: string, password1: string, password2: string) {
    // TODO: implement signup
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('APPLICATION_ID');
    localStorage.removeItem('SUB_APPLICATION_ID');
    localStorage.removeItem('ID')
  }

  refreshToken() {
    if (moment().isBetween(this.getExpiration().subtract(1, 'days'), this.getExpiration())) {
      return this.http.post(
        this.apiRoot.concat('refresh-token/'),
        { token: this.token }
      ).pipe(
        tap(response => this.setSession(response)),
        shareReplay(),
      ).subscribe();
    }
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);

    return moment(expiresAt);
  }

  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'JWT '.concat(token))
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  } 
}

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    if (this.authService.isLoggedIn()) {
      this.authService.refreshToken();

      return true;
    } else {
      this.authService.logout();
      this.router.navigate(['']);

      return false;
    }
  }
}

export interface JWTPayload {
  ID: number;
  username: string;
  email: string;
  exp: number;
  orig_lat: Date;
  role: string;
  APPLICATION_ID: string;
  SUB_APPLICATION_ID: string;
  COMPANY_ID: string;
}
