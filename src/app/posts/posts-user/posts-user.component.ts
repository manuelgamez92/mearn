import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { PageEvent } from "@angular/material";
import { AuthService } from "src/app/auth/auth.service";
import { User } from "src/app/auth/user.model";

@Component({
  selector: "app-posts-user",
  templateUrl: "./posts-user.component.html",
  styleUrls: ["./posts-user.component.scss"]
})
export class PostsUserComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  posts: Post[] = [];
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
  pageSizeOptions = [1,2,5,10];
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

 

  ngOnInit() {
    this.isLoading=true;
    this.userId=this.authService.getUserId();
    this.username=this.authService.getUsername();

    this.postsService.getUserPosts(this.perPage,this.currentPage,this.userId); 

  
    
    this.postsSub = this.postsService.getUserPostUpdateListener()
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
      this.postsService.getUserPosts(this.perPage,this.currentPage,this.userId);

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




