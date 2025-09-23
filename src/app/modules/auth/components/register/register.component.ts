import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from '../../auth.service';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { User } from 'src/app/modules/shared/models/auth/user.model';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  
  registerForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];
  showProgress = false; // নতুন যোগ করো
  progress = 0; // নতুন যোগ করো
  private hubConnection: signalR.HubConnection | null = null; // নতুন যোগ করো
  private isSignalRConnected = false; // নতুন যোগ করো

  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.authService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user) {
          this.router.navigateByUrl('/');
        }
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.initSignalR();
  }

  ngOnDestroy(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  private initSignalR(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/progressHub`, {
        withCredentials: true // কুকি সাপোর্ট
      })
      .withAutomaticReconnect() // স্বয়ংক্রিয় রিকানেক্ট
      .build();

    this.hubConnection.start()
      .then(() => {
        this.isSignalRConnected = true;
        console.log('SignalR Connected');
      })
      .catch(err => {
        console.error('SignalR Connection Error: ', err);
        setTimeout(() => this.initSignalR(), 5000); // ৫ সেকেন্ড পর রিট্রাই
      });

    this.hubConnection.on('ReceiveProgress', (progress: number) => {
      this.progress = progress;
      if (progress >= 100) {
        this.showProgress = false;
      }
    });

    this.hubConnection.onreconnected(() => {
      this.isSignalRConnected = true;
      console.log('SignalR Reconnected');
    });

    this.hubConnection.onclose(() => {
      this.isSignalRConnected = false;
      console.log('SignalR Connection Closed');
    });
  }

  initializeForm() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
    });
  }

  register() {
    this.submitted = true;
    this.errorMessages = [];

    if (this.registerForm.valid) {
      if (!this.isSignalRConnected || !this.hubConnection?.connectionId) {
        this.errorMessages.push('Real-time progress is unavailable. Please try again.');
        return;
      }

      this.showProgress = true;
      this.progress = 0;

      const connectionId = this.hubConnection.connectionId || '';
      const model = {
        ...this.registerForm.value,
        connectionId // কুয়েরি প্যারামিটার হিসেবে পাঠাও
      };

      this.authService.register(model).subscribe({
        next: (response: any) => {
          console.log('Response: ' + response);
          this.sharedService.showNotification(true, response.value.title, response.value.message);
          this.router.navigateByUrl('/auth/login');
        },
        error: error => {
          this.showProgress = false;
          if (error.error.errors) {
            this.errorMessages = error.error.errors;
          } else {
            this.errorMessages.push(error.error);
          }
        }
      });
    }
  }

  getGradient(): string {
    return `linear-gradient(90deg, #00b4db ${this.progress - 20}%, #0083b0 ${this.progress}%)`;
  }
}