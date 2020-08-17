import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { PageEvent } from "@angular/material";
import { AuthService } from "src/app/auth/auth.service";
import { User } from "src/app/auth/user.model";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.scss"]
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  posts: Post[] = [];
  users : User[] = [];
  private postsSub: Subscription;
  private postSearchSub: Subscription;
  private userSub: Subscription;
  private authStatusSub: Subscription;
  isSearch = false
  authActive = false;
  isLoading=false;
  totalPosts=0;
  perPage=10;
  currentPage=1;
  pageSizeOptions = [10,20,50,100];
  userId: string;
  username:string="Usuario";
  constructor(public postsService: PostsService, private authService : AuthService) {
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[];postCount:number}) => {
        this.isLoading=false;
        this.posts = postData.posts;
        console.log(this.posts);
        this.totalPosts=postData.postCount;
        this.isSearch=false;
        console.log("triggeer update");
        


      });

      this.postSearchSub = this.postsService.getSearchPostListener()
      .subscribe((postData: {posts: Post[];postCount:number}) => {
        this.isLoading=false;
        this.posts = postData.posts;
        this.totalPosts=postData.postCount;
        this.isSearch=true;
        console.log("triggeer search");
        console.log(this.totalPosts);


      });
      


  }

    getUserById(id:string){
    const user = this.users.filter(x => x.id === id);
    if(user[0].email){
      return user[0].email;
    }else {
      return "sin email";
    }
  }

  ngOnInit() {
    console.log(this.userId);
    this.isLoading=true;
    //this.authService.getUsers();//obetenemos los usuarios

    this.postsService.getPosts(this.perPage,this.currentPage);//obtenemos los posts 
    this.userId=this.authService.getUserId();
    this.username=this.authService.getUsername();
    /*this.userSub = this.authService.getUserUpdateListener()
    .subscribe((userData: {users: User[];}) => {
      this.isLoading=false;
      this.users = userData.users;
    });*/

  
    
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[];postCount:number}) => {
      this.isLoading=false;
      this.posts = postData.posts;
      console.log("triggeer update oninit");
      this.totalPosts=postData.postCount;
      });
      
      this.postSearchSub = this.postsService.getSearchPostListener()
      .subscribe((postData: {posts: Post[];postCount:number}) => {
        this.isLoading=false;
        this.posts = postData.posts;
        this.totalPosts=postData.postCount;
        this.isSearch=true;
        console.log("trigger oninit");
        console.log(this.totalPosts);

      });
      
    

      this.authActive = this.authService.getIsAuth();
      this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
        isAuthenticated=>{
          this.authActive = isAuthenticated;
          this.userId=this.authService.getUserId();

        }
      )

  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.postSearchSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading=true;
    this.currentPage=pageData.pageIndex+1;
    this.perPage = pageData.pageSize;
    if(!this.isSearch){
      this.postsService.getPosts(this.perPage,this.currentPage);

    }else{
      this.postsService.isSearchPost(this.currentPage,this.perPage);

    }

  }

  onDelete(PostId:string){
    this.postsService.deletePost(PostId).subscribe(()=>{
      this.postsService.getPosts(this.perPage,this.currentPage);
      ()=>{
      this.isLoading=false;
    }});
  }


}




