import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SharedService } from '../shared.service';
import { User } from '../models/auth/user.model';

export const AuthorizationGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const sharedService = inject(SharedService);
  const router = inject(Router);


  return authService.user$.pipe(
    map((user: User | null) => {
      if (user) {
        return true;
      } else {
        sharedService.showNotification(false, 'Restricted Area', 'Leave immediately!');
        router.navigate(['account/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    })
  );
};