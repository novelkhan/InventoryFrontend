import { Component, HostListener, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { AuthService } from './modules/auth/auth.service';
import { SharedService } from './modules/shared/shared.service';
import { User } from './modules/shared/models/auth/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService,
    public sharedService: SharedService) {}

  ngOnInit(): void {
    this.refreshUser();
  }

  @HostListener('window:keydown')
  @HostListener('window:mousedown')
  checkUserActivity() {
    this.authService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user) {
          clearTimeout(this.authService.timeoutId);
          this.authService.checkUserIdleTimout();
        }
      }
    })
  }

  private refreshUser() {
    const jwt = this.authService.getJWT();
    if (jwt) {
      this.authService.refreshUser(jwt).subscribe({
        next: _ => {},
        error: error => {
          this.authService.logout();

          if (error.status === 401) {
            this.sharedService.showNotification(false, 'Account blocked', error.error);
          }
        }
      })
    } else {
      this.authService.refreshUser(null).subscribe();
    }
  }
}