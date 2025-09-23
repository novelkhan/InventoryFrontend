import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from '../../auth.service';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { User } from 'src/app/modules/shared/models/auth/user.model';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  
  loginForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];
  returnUrl: string | null = null;
  showProgress = false;
  progress = 0;
  private hubConnection: signalR.HubConnection | null = null;
  private isSignalRConnected = false; // নতুন যোগ করো

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService
  ) { 
    this.authService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user) {
          this.router.navigateByUrl('/');
        } else {
          this.activatedRoute.queryParamMap.subscribe({
            next: (params: any) => {
              if (params) {
                this.returnUrl = params.get('returnUrl');
              }
            }
          });
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
        withCredentials: true // কুকি সাপোর্ট করো
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
        // রিট্রাই লজিক
        setTimeout(() => this.initSignalR(), 5000); // ৫ সেকেন্ড পর আবার চেষ্টা
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
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.submitted = true;
    this.errorMessages = [];

    if (this.loginForm.valid) {
      if (!this.isSignalRConnected || !this.hubConnection?.connectionId) {
        this.errorMessages.push('Real-time progress is unavailable. Please try again.');
        return;
      }

      this.showProgress = true;
      this.progress = 0;

      const connectionId = this.hubConnection.connectionId || '';
      const model = {
        ...this.loginForm.value,
        connectionId // কুয়েরি প্যারামিটার হিসেবে পাঠাও
      };

      this.authService.login(model).subscribe({
        next: _ => {
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigateByUrl('/');
          }
        },
        error: error => {
          console.log(error);
          this.showProgress = false;
          if (error.error.errors) {
            this.errorMessages = error.error.errors;
          } else {
            this.errorMessages.push(error.error || 'Login failed');
          }
        }
      });
    }
  }

  getGradient(): string {
    return `linear-gradient(90deg, #00b4db ${this.progress - 20}%, #0083b0 ${this.progress}%)`;
  }
}