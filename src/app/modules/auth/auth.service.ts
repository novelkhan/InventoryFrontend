import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { map, of, ReplaySubject, take } from 'rxjs';
import { User } from '../shared/models/auth/user.model';
import { environment } from 'src/environments/environment.development';
import { Login } from '../shared/models/auth/login.model';
import { Register } from '../shared/models/auth/register.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSource = new ReplaySubject<User | null>(1);
  user$ = this.userSource.asObservable();

  refreshTokenTimeout: any;
  timeoutId: any;

  constructor(private http: HttpClient, 
    private router: Router,
    private sharedService: SharedService) { }



  refreshToken = async () => {
    this.http.post<User>(`${environment.apiUrl}/api/auth/refresh-token`, {}, {withCredentials: true})
    .subscribe({
      next: (user: User) => {
        if (user) {
          this.setUser(user);
        }
      }, error: error => {
        this.sharedService.showNotification(false, 'Error', error.error);
        this.logout();
      }
    })
  }



  refreshUser(jwt: string | null) {
    if (jwt === null) {
      this.userSource.next(null);
      return of(undefined);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);

    return this.http.get<User>(`${environment.apiUrl}/api/auth/refresh-page`, {headers, withCredentials: true}).pipe(
      map((user: User) => {
        if (user) {
          this.setUser(user);
        }
      })
    )
  }

  login(model: any) {
    const params = new HttpParams().set('connectionId', model.connectionId || '');
    return this.http.post<User>(`${environment.apiUrl}/api/auth/login`, model, { params, withCredentials: true })
      .pipe(
        map((user: User) => {
          if (user) {
            this.setUser(user);
          }
        })
      );
  }

 

  logout(isManualLogout: boolean = false) {
    localStorage.removeItem(environment.userKey);
    this.userSource.next(null);
    this.router.navigateByUrl('/');
    this.stopRefreshTokenTimer();
    
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    
    this.sharedService.closeExpiringSessionModal();
  }

  register(model: Register) {
    return this.http.post(`${environment.apiUrl}/api/auth/register`, model);
  }

  getJWT() {
    const key = localStorage.getItem(environment.userKey);
    if (key) {
      const user: User = JSON.parse(key);
      return user.jwt;
    } else {
      return null;
    }
  }

  checkUserIdleTimout() {
    this.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user) {
          if (!this.sharedService.displayingExpiringSessionModal) {
            this.timeoutId = setTimeout(() => {
              this.sharedService.displayingExpiringSessionModal = true;
              this.sharedService.openExpiringSessionCountdown(environment.countdownDurationInSeconds);
            }, environment.idleTimeoutInMilliSeconds); // ← এখানে environment ব্যবহার হচ্ছে
          }
        }
      }
    });
  }


  private setUser(user: User) {
    this.stopRefreshTokenTimer();
    this.startRefreshTokenTimer(user.jwt);
    localStorage.setItem(environment.userKey, JSON.stringify(user));
    this.userSource.next(user);

    this.sharedService.displayingExpiringSessionModal = false;
    this.checkUserIdleTimout();
  }

  private startRefreshTokenTimer(jwt: string) {
    const decodedToken: any = jwtDecode(jwt);
    // expires in seconds
    const expires = new Date(decodedToken.exp * 1000);
    // 30 seconds before the expiration
    const timeout = expires.getTime() - Date.now() - (30 * 1000);
    this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}