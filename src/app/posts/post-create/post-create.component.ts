import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { mimeType} from "./mime-type.validator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = "Create a experience";
  enteredContent = "";
  isLoading = false;
  imagePreview : string | File;
  form: FormGroup;
  private mode = 'create';
  private postId: string;
  post: Post | any;
  private authSub : Subscription;

  constructor(public postsService: PostsService, public route: ActivatedRoute, private authService: AuthService) {}
   
  ngOnInit(){
    
    this.authSub = this.authService.getAuthStatusListener().subscribe(authSub=>{
      this.isLoading=false;
    });
    this.form = new FormGroup({
      'title':new FormControl(null, {validators:[Validators.required, Validators.minLength(3)] , }),
      'content':new FormControl(null, {validators:[Validators.required, Validators.minLength(3)] , }),
      'image':new FormControl(null, {validators:[Validators.required] ,asyncValidators:[mimeType] }),

    });
   

    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has('postId')){
       this.mode= 'edit';
       this.postId = paramMap.get('postId');
       this.isLoading=true;
     
       this.postsService.getPost(this.postId).subscribe(postData=>
        {
          this.isLoading=false;
          this.enteredTitle="Edit your experience";
          this.post = {id:postData._id,title:postData.title,content:postData.content,imagePath:postData.imagePath,creator:postData.creator,date:Date.now().toString(),author:postData.username};
          this.form.setValue({'title': this.post.title, 'content':this.post.content, 'image':this.post.imagePath});
          this.imagePreview = this.post.imagePath;
        });
      }else{
        this.mode='create';
        this.postId=null;
        this.imagePreview=null;
   
      }
    });
  }

  ngOnDestroy(){
      this.authSub.unsubscribe();
  }
  onImagePicked(event :   Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image:file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = ()=>{
      this.imagePreview = reader.result.toString();
    }
    reader.readAsDataURL(file);
  }
  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading=true;
    if(this.mode==='create'){
      this.postsService.addPost(this.form.value.title, this.form.value.content,this.form.value.image);

    }else{
      this.postsService.updatePost(this.postId,this.form.value.title, this.form.value.content,this.form.value.image);

    }
    this.form.reset();
  }
}
