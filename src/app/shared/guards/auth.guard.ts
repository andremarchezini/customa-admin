import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../authentication';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(public authSvc: AuthenticationService, private router: Router) {}

  async canActivate() {
    if (this.authSvc.isAuthenticated()) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
    }

    return true;
  }
}
