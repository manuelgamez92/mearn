import {Component, OnInit, OnDestroy} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';


@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']

})
export class LoginComponent implements OnInit, OnDestroy {

    private authStatusSub: Subscription;

    constructor(public authService: AuthService){}
    isLoading=false;
    ngOnInit(){
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus)=>{
         this.isLoading=false;
         });
     }
    onLogin(form: NgForm){
        if(form.invalid){
            return;
        }
 
        this.authService.login(form.value.email,form.value.password);
        this.isLoading=true;
    }
    ngOnDestroy(){
        this.authStatusSub.unsubscribe();
    }
}