import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from '../../auth.service';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { User } from 'src/app/modules/shared/models/auth/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  
  registerForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];

  constructor(private authService: AuthService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private router: Router) {
      this.authService.user$.pipe(take(1)).subscribe({
        next: (user: User | null) => {
          if (user) {
            this.router.navigateByUrl('/');
          }
        }
      })
    }

  ngOnInit(): void {
    this.initializeForm();
  }
  

  initializeForm() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
    })
  }

  register() {
    this.submitted = true;
    this.errorMessages = [];

    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (response: any) => {
          console.log('Response: ' + response);
          this.sharedService.showNotification(true, response.value.title, response.value.message);
          this.router.navigateByUrl('/auth/login');
        },
        error: error => {
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