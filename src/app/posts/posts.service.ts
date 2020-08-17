import { Injectable, EventEmitter } from '@angular/core';
import { Subject, Observable, observable } from 'rxjs';

import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap, mergeMapTo, concatMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { environment } from "../../environments/environment";
import { AuthService } from '../auth/auth.service';

const BACKEND_URL = environment.apiURL + "posts/";
const BACKEND_URL2 = environment.apiURL + "user";
@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private userPosts: Post[] = [];
  homeworld: Observable<{}>;
  private postListener = new Subject<{ posts: Post[], maxPosts: any }>();

  searchText = "";
  creatorImage: string;
  search = new EventEmitter<string>();
  private isSearch = new Subject<{ posts: Post[], postCount: number }>();
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();
  private userPostsUpdated = new Subject<{ posts: Post[], postCount: number }>();
  constructor(public http: HttpClient, private router: Router, public authService: AuthService) {

  }


  postsUserOrder(posts: any[], maxPosts: any) {

    return {
      posts: posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          creator: post.creator,
          date: post.date,
          author: post.author,
          authorImage: "null"
        };
      }),
      maxPosts: maxPosts
    }
  }

  postsOrder(posts: any[], maxPosts: any) {

    return {
      posts: posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          creator: post.creator,
          date: post.date,
          author: post.author,
          authorImage: "null"
        };
      }),
      maxPosts: maxPosts
    }
  }

  getUsersImage(posts: Post[], maxPosts: any) {
    for (let i = 0; i < posts.length; i++) {
      let obj = new Object({ userId: posts[i].creator });
      this.http.post<{ message: string; user: any; }>(
        BACKEND_URL2 + "/getUser", obj
      ).subscribe(user => {
        posts[i].authorImage = user.user.imagePath;

      });

    }
    return {
      posts: posts,
      maxPosts: maxPosts
    };


  }


  getUserImage(posts: Post[], maxPosts: any) {
    for (let i = 0; i < posts.length; i++) {
      let obj = new Object({ userId: posts[i].creator });
      this.http.post<{ message: string; user: any; }>(
        BACKEND_URL2 + "/getUser", obj
      ).subscribe(user => {
        posts[i].authorImage = user.user.imagePath;

      });

    }
    return {
      posts: posts,
      maxPosts: maxPosts
    };


  }


  getSingleUser(posts: Post[], maxPosts: any): Observable<any> {
    posts.forEach(function (post) {
    });

    const obj = new Object({ userId: "userId" });
    return this.http.post<{ message: string; user: any; }>(
      BACKEND_URL2 + "/getUser", obj
    );

  }

  getPosts$(posts: Post[], maxPosts: any): Observable<{ posts: Post[], maxPosts: any }> {

    for (let i = 0; i < posts.length; i++) {
      const obj = new Object({ userId: posts[i].creator });
      this.http.post<{ message: string; user: any; }>(
        BACKEND_URL2 + "/getUser", obj
      ).subscribe(user => {
        posts[i].authorImage = user.user.imagePath;

      });

    }

    this.postListener.next({
      posts: [...posts],
      maxPosts: maxPosts
    })
    console.log("console:" + posts.toString());
    return this.postListener.asObservable();
  }
  getPosts(postsPerPage: number, currentPage: number) {

    let imagePath;
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((postData) => this.postsOrder(postData.posts, postData.maxPosts)),
        map((postData2) => this.getUsersImage(postData2.posts, postData2.maxPosts)
        )
      ).subscribe((transformedPostData: any) => {

        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });

      })
  }


  getUserPosts(postsPerPage: number, currentPage: number, creator: string) {
    let postData = Object({ page: currentPage, pageSize: postsPerPage, creator: creator });

    this.http
      .post<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + "getYourPosts/", postData
      )
      .pipe(
        map((postData) => this.postsUserOrder(postData.posts, postData.maxPosts)),
        map((postData2) => this.getUserImage(postData2.posts, postData2.maxPosts)
        ))
      .subscribe(transformedPostData => {
        console.log(transformedPostData);
        this.userPosts = transformedPostData.posts;
        this.userPostsUpdated.next({
          posts: [...this.userPosts],
          postCount: transformedPostData.maxPosts
        });

      });
  }


  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getUserPostUpdateListener() {
    return this.userPostsUpdated.asObservable();
  }

  getSearchPostListener() {
    return this.isSearch.asObservable();
  }

  addPost(title: string, content: string, image: File) {

    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http.post<{ message: string, post: Post }>(BACKEND_URL, postData)
      .subscribe((responseData) => {


        this.router.navigate(['/']);
      })

  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string, username: string }>(BACKEND_URL + id);
  }
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData | any;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);

    } else {
      postData = { id: id, title: title, content: content, imagePath: image, creator: null, date: Date.now().toString(), author: null }
    }

    this.http.put(BACKEND_URL + id, postData)
      .subscribe(response => {

        this.router.navigate(['/']);
      });

  }

  searchPost(text: string, currentPage, postsPerPage) {
    this.searchText = text;
    let postData = Object({ page: currentPage, pageSize: postsPerPage, text: text });

    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}&text=${text}`;
    this.http.post<{ message: string; posts: any; maxPosts: number }>(
      BACKEND_URL + "search/", postData
    )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
                date: post.date,
                author: post.author
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        console.log(transformedPostData);
        this.posts = transformedPostData.posts;
        this.isSearch.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
        this.userPosts = transformedPostData.posts;
        this.isSearch.next({
          posts: [...this.userPosts],
          postCount: transformedPostData.maxPosts
        });
      });
  }




  isSearchPost(currentPage, postsPerPage) {
    let text = this.searchText;
    console.log("holis" + this.searchText);
    let postData = Object({ page: currentPage, pageSize: postsPerPage, text: text });

    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}&text=${text}`;
    this.http.post<{ message: string; posts: any; maxPosts: number }>(
      BACKEND_URL + "search/", postData
    )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
                date: post.date,
                author: post.author
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        console.log(transformedPostData);
        this.posts = transformedPostData.posts;
        this.isSearch.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);

  }


}