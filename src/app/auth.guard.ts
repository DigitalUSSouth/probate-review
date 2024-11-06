import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { getCurrentUser } from 'aws-amplify/auth';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  // constructor(public authenticator: AuthenticatorService) {}
  constructor(private _router: Router ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // from https://itnext.io/part-2-adding-authentication-to-your-angular-material-aws-amplify-powered-pwa-2a9d0fbd305a
    return getCurrentUser().then(() => { return true; })
      .catch(() => {
        this._router.navigate(['/']);
        return false;
      });
  }

}
