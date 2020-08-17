import { Component, OnInit, OnDestroy, Output, EventEmitter } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import * as $ from "jquery";
import { PostsService } from "../posts/posts.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy{

 @Output() onFilter = new EventEmitter();
 userIsAuth = false;
 username:string="Usuario";
 private authListener : Subscription;
  constructor(private authService: AuthService, private postService: PostsService, private router : Router){}
  ngOnInit(){

    /*var imageFile = ["bg.jpeg", "bg2.jpeg"];
    var currentIndex = 0;
    setInterval(function () {
        if (currentIndex == imageFile.length) {
            currentIndex = 0;
        }
        $(".bg").css('background', 'linear-gradient(rgba(0, 0, 0, 0.57), rgba(0, 0, 0, 0.57)), url("./../../assets/img/' + imageFile[currentIndex++] + '")');
        $(".bg").css('transition', 'all 5s ease-in-out 0s');

    }, 10000);*/


  this.username=this.authService.getUsername();
  this.authListener = this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
  this.userIsAuth = isAuthenticated;
   });
   this.userIsAuth = this.authService.getIsAuth(); 
   this.username = this.authService.getUsername();
  }
  ngOnDestroy(){

  }

  search(text:string) {
    this.postService.searchPost(text,1,10);
}
  onLogOut(){
    this.authService.logOut();
  }
  
  navigateYourPosts(){
    console.log("holaaa");
    this.router.navigate(['/']);
  }
  changeRoute($event){
    if($event.index===0){
      this.router.navigate(['/']);

    }else if($event.index===1){
      this.router.navigate(['/postsUser']);

    }else if($event.index===2){
      this.router.navigate(['/profile']);

    }
    
}


}
