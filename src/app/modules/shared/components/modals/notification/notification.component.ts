import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharedService } from '../../../shared.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  isSuccess: boolean = true;
  title: string = '';
  message: string = '';
  private callback?: () => void;


  private destroy$ = new Subject<void>();

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.notification$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notification => {
        this.isSuccess = notification.isSuccess;
        this.title = notification.title;
        this.message = notification.message;
        this.callback = notification.callback;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeModal() {
    const modalElement = document.getElementById('notificationModal');
    if (modalElement) {
      (document.activeElement as HTMLElement)?.blur();
      document.body.focus();

      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      modalElement.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');

      if (this.callback) {
        this.callback();
      }
    }
  }
}