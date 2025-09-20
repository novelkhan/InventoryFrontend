import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { ValidationMessagesComponent } from './components/errors/validation-messages/validation-messages.component';
import { NotificationComponent } from './components/modals/notification/notification.component';
import { ExpiringSessionCountdownComponent } from './components/modals/expiring-session-countdown/expiring-session-countdown.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    NotFoundComponent,
    ValidationMessagesComponent,
    NotificationComponent,
    ExpiringSessionCountdownComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    ValidationMessagesComponent,
    NotificationComponent,
    ExpiringSessionCountdownComponent
  ]
})
export class SharedModule { }
