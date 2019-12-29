import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class NegateAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (localStorage.getItem("account") !== null) {
      this.router.navigateByUrl("orders");
      return false;
    } else {
      return this.authService.getAuthStatus().pipe(
        map(
          (res: any) => {
            if (res.success) {
              localStorage.setItem("account", JSON.stringify(res.data));
            }
            return !res.success;
          },
          (error: any) => {
            console.log(error);
          }
        )
      );
    }
  }
}
