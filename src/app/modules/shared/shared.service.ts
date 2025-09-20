import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  displayingExpiringSessionModal = false;
  private notificationSubject = new Subject<{ isSuccess: boolean, title: string, message: string, callback?: () => void }>();
  notification$ = this.notificationSubject.asObservable();
  // Add a Subject to emit when the modal is opened
  private modalOpenedSubject = new Subject<number>();
  modalOpened$ = this.modalOpenedSubject.asObservable();

  constructor() {}

  showNotification(isSuccess: boolean, title: string, message: string, callback?: () => void) {
    this.notificationSubject.next({ isSuccess, title, message, callback });
    this.openNotificationModal();
  }

  private openNotificationModal() {
    const modalElement = document.getElementById('notificationModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      modalElement.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    }
  }

  openExpiringSessionCountdown(targetTime: number = 5) {
    const modalElement = document.getElementById('sessionModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      modalElement.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      this.modalOpenedSubject.next(targetTime);
    }
  }

  closeExpiringSessionModal() {
    this.displayingExpiringSessionModal = false;
    const modalElement = document.getElementById('sessionModal');
    if (modalElement) {
      (document.activeElement as HTMLElement)?.blur();
      document.body.focus();

      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      modalElement.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    }
    this.modalOpenedSubject.next(0);
  }
}