import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from '../../auth.service';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { User } from 'src/app/modules/shared/models/auth/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  loginForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];
  returnUrl: string | null = null;

  constructor(private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService) { 
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
            })
          }
        }
      })
    }

  ngOnInit(): void {
    this.initializeForm();
  }
  

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  login() {
    this.submitted = true;
    this.errorMessages = [];

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: _ => {
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigateByUrl('/');
          }
        },
        error: error => {
          console.log(error);
          if (error.error.errors) {
            this.errorMessages = error.error.errors;
          } else {
            this.errorMessages.push(error.error);
          }
        }
      })
    }
  }
}