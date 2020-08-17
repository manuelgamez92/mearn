import { CanActivate,ActivatedRouteSnapshot,RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import {Observable} from 'rxjs';
@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private authService: AuthService, private router : Router){}
    canActivate(route:ActivatedRouteSnapshot, RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
      
       const isAuth = this.authService.getIsAuth();
       if(!isAuth)
{
    this.router.navigate(['/login']);
}      return isAuth;
    }



}