import {Component, OnInit, OnDestroy} from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { ConfirmedValidator } from '../signup/confirmed.validator';
import { MatDialog } from '@angular/material';
import { ModalComponent } from '../modal/modal.component';


@Component({
    templateUrl: './forgotpassword.component.html',
    styleUrls: ['./forgotpassword.component.css']

})
export class ForgotpasswordComponent implements OnInit, OnDestroy{


    form: FormGroup = new FormGroup({});

    isLoading=false;
    private authStatusSub: Subscription;
    constructor(public authService: AuthService,private fb: FormBuilder,private dialog: MatDialog){

        this.form = fb.group({
            email: ['', [Validators.required]],
          })
        }
   
    get f(){
            return this.form.controls;
    }

    ngOnInit(){
       
        
    }
    forgotPassword(form: FormGroup){
       if(form.invalid){
           return
        }
    this.isLoading=true;
    this.authService.forgotPassword(this.form.controls["email"].value).subscribe(response=>{
          
        if(response.reseatLink){
            this.authService.setReseatLink(response.reseatLink);
            this.dialog.open(ModalComponent, {data:{message:response.message}});
        }
        this.isLoading=false;
      },  error=>{
        this.isLoading=false;
        });
      
    }

    ngOnDestroy(){
    }
}