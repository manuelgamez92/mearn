import {Component, OnInit, OnDestroy} from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { ConfirmedValidator } from './../signup/confirmed.validator';
import { MatDialog } from '@angular/material';
import { ModalComponent } from '../modal/modal.component';
import { Router } from '@angular/router';


@Component({
    templateUrl: './changepassword.component.html',
    styleUrls: ['./changepassword.component.css']

})
export class ChangepasswordComponent implements OnInit, OnDestroy{


    form: FormGroup = new FormGroup({});

    isLoading=false;
    private passwordStatusSub: Subscription;

    constructor(public authService: AuthService,private fb: FormBuilder,private dialog: MatDialog,private router : Router){

        this.form = fb.group({
            password: ['', [Validators.required]],
            passwordRep: ['', [Validators.required]]
          }, { 
            validator: ConfirmedValidator('password', 'passwordRep')
          })
        }
   
    get f(){
            return this.form.controls;
    }

    ngOnInit(){
        this.passwordStatusSub = this.authService.getPasswordListener().subscribe((passwordToken)=>{
            if(passwordToken)
            {      this.isLoading=false; }
            else{
                this.isLoading=false;
                this.router.navigate(['/login']);               
            }
            this.isLoading=false;
            });
    }
    changePassword(form: FormGroup){
       if(form.invalid){
           return
       }
    this.isLoading=true;
    this.authService.resetPassword(this.authService.getResetLink(),this.form.controls["password"].value).subscribe(response=>{
        if(response){
            this.authService.clearLink();
            this.dialog.open(ModalComponent, {data:{message:response.message}});
            
            this.isLoading=false;
            this.dialog.afterAllClosed.subscribe(() => {
                
                this.router.navigate(['/login']);               
            });
        }
      
      },  error=>{
        this.isLoading=false;
        });
      
        this.isLoading=false;
    }

    ngOnDestroy(){
        this.authService.clearLink();
    }
}