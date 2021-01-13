import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})

// Professor Gomez's AuthGuardService - Thanks!
export class AuthorizationService {

  constructor(private router: Router, private userService: UserService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean
  {
    const loggedInUser = this.userService.GetLoggedInUser();

    if (loggedInUser !== null && (new Date(loggedInUser.exp * 1000) > new Date()))
    {
      return true;
    }
    else
    {
      this.router.navigate(['/login', {newusermsg: `You must be logged in to access Home`}]);
      return false;
    }
  }
  getHomeUser(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean
  {
    const loggedInUser = this.userService.GetLoggedInUser();

    if (loggedInUser !== null && (new Date(loggedInUser.exp * 1000) > new Date()))
      return true;
    else
      return false;
  }
}
