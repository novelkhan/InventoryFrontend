import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';
import { User } from '../../../models/auth/user.model';
import { SharedService } from '../../../shared.service';
import { AuthService } from 'src/app/modules/auth/auth.service';

@Component({
  selector: 'app-expiring-session-countdown',
  templateUrl: './expiring-session-countdown.component.html',
  styleUrls: ['./expiring-session-countdown.component.scss']
})
export class ExpiringSessionCountdownComponent implements OnInit, OnDestroy {
  targetTime: number = environment.countdownDurationInSeconds;
  remainingTime: number = this.targetTime;
  displayTime: string = this.formatTime(this.remainingTime);

  private countdown$ = new Subject<void>(); // countdown stop signal
  private destroy$ = new Subject<void>();   // component destroy signal

  constructor(
    private authService: AuthService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    // ✅ যখন user null হয়ে যাবে তখন countdown বন্ধ করো
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User | null) => {
        if (!user) {
          this.stopCountdown();
          this.closeModal();
        }
      });

    // ✅ modal open/close signal
    this.sharedService.modalOpened$
      .pipe(takeUntil(this.destroy$))
      .subscribe((targetTime: number) => {
        this.targetTime = targetTime;
        if (targetTime > 0) {
          this.resetCountdown();
          this.startCountDown();
        } else {
          this.stopCountdown();
          this.closeModal();
        }
      });
  }

  ngOnDestroy(): void {
    this.stopCountdown();
    this.destroy$.next();   // সব subscription বন্ধ
    this.destroy$.complete();
  }

  resetCountdown() {
    this.stopCountdown();
    this.remainingTime = this.targetTime;
    this.displayTime = this.formatTime(this.remainingTime);
  }

  startCountDown() {
    this.stopCountdown(); // safe start
    interval(1000)
      .pipe(takeUntil(this.countdown$), takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
          this.displayTime = this.formatTime(this.remainingTime);
        } else {
          this.stopCountdown();
          this.sharedService.showNotification(
            false,
            'Logged Out',
            'You have been logged out due to inactivity'
          );
          this.logout(false); // isManualLogout = false
        }
      });
  }

  private stopCountdown() {
    this.countdown$.next(); // active interval বন্ধ করে
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
  }

  private pad(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

  logout(isManualLogout: boolean = false) {
    this.closeModal();
    this.stopCountdown();
    this.authService.logout(isManualLogout);
    this.sharedService.closeExpiringSessionModal();
  }

  closeModal() {
    const modalElement = document.getElementById('sessionModal');
    if (modalElement) {
      (document.activeElement as HTMLElement)?.blur();
      document.body.focus();

      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      modalElement.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    }
  }

  resumeSession() {
    this.stopCountdown();
    this.resetCountdown();
    this.closeModal();
    this.authService.refreshToken();
  }
}