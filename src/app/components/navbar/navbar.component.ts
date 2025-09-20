import { Component } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  collapsed = true;

  constructor(public authService: AuthService) { }

  logout() {
    this.authService.logout(true);
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }
}