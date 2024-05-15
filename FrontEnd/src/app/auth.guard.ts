// AuthGuard
import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild,
  Router, ActivatedRouteSnapshot, RouterStateSnapshot
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLogin(state.url);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLogin(state.url);
  }

  private checkLogin(url: string): boolean {
    const token = localStorage.getItem('token');
    console.log('AuthGuard#checkLogin - URL:', url, 'Token:', token);
    if (!token) {
      this.router.navigate(['/auth'], { queryParams: { returnUrl: url } });
      return false;
    }
    return true;
}
}
