import { Injectable, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,  BehaviorSubject ,  ReplaySubject } from 'rxjs';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models';
import { map ,  distinctUntilChanged } from 'rxjs/operators';


@Injectable()


export class UserService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor (
    private apiService: ApiService,
    private http: HttpClient,
    private jwtService: JwtService
  ) {}

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // If JWT detected, attempt to get & store user's info

    let token = this.jwtService.getToken();
    if (token) {
      this.apiService.usersCheckToken('/user/logued')
      .subscribe(
        data => {
          data.User.Bearer = token;
          this.setAuth(data.User);
        },
        err => this.purgeAuth()
      );
    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  setAuth(user: User) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(user.Bearer);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  setAuthAdmin(token: String) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveAdminToken(token);
    // Set current user data into observable
    // this.currentUserSubject.next(token);
    // Set isAuthenticated to true
    // this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next({} as User);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  attemptAuth(type:String, credentials:[]): Observable<User> {
    const route = (type === 'login') ? 'login' : '';
    return this.apiService.usersPost('/users/' + route, {user: credentials})
      .pipe(map(
      data => {
          
        if (data.user.type == "admin") { // Es administrador
          this.loginLaravel(credentials).subscribe(data =>{ console.log(data)});
        }
        this.setAuth(data.user);

        if (type !== 'login')
          this.apiService.setProfile('/profile').subscribe(); //data =>{ console.log(data)}
        

        return data;
      }
    ));
  }

  //Login en laravel admin
  loginLaravel(credentials:[]): Observable<User> {
    return this.apiService.loginLaravel('/users/login', {user: credentials})
    .pipe(map(
      data => {
        this.setAuthAdmin(data.token);
        return data;
      }
    ));
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  // Update the user on the server (email, pass, etc)
  update(user:User): Observable<User>  {   //Originalmente-> (user): Observable<User>
    return this.apiService
    .put('/user/', { user })
    .pipe(map(data => {
      // Update the currentUser observable
      this.currentUserSubject.next(data.user);
      return data.user;
    }));
  }
}