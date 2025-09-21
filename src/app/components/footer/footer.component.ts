import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  companyName = 'E-Commerce Inventory';
  quickLinks = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/inventory/products' },
    { name: 'Categories', url: '/inventory/categories' },
    { name: 'Login', url: '/auth/login' }
  ];
  socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com', icon: 'bi bi-facebook' },
    { name: 'Twitter', url: 'https://twitter.com', icon: 'bi bi-twitter' },
    { name: 'Instagram', url: 'https://instagram.com', icon: 'bi bi-instagram' }
  ];
  contactInfo = {
    email: 'novel4004@gmail.com',
    phone: '+880 163 311 8253',
    address: 'Sabalia, Tangail, Bangladesh'
  };
}