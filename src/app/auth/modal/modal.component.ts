import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
@Component({
    templateUrl: './modal.component.html'
})

export class ModalComponent {

constructor(@Inject(MAT_DIALOG_DATA) public data:{message:string}){

}
message="An known Error";

}