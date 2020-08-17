import { Component, OnInit, OnDestroy, Output, EventEmitter } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import * as $ from "jquery";
import { PostsService } from "../posts/posts.service";
import { User } from "../auth/user.model";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {

  isLoading = false;
  users: User[] = [];
  private usersSub: Subscription;
  constructor(private authService: AuthService) {

    this.usersSub = this.authService.getUserUpdateListener()
      .subscribe((usersData: { users: User[]; message: string }) => {
        this.isLoading = false;
        this.users = usersData.users;
      });
  }
  ngOnInit() {
    this.authService.getUsers();
    this.isLoading = true;
    this.usersSub = this.authService.getUserUpdateListener()
      .subscribe((usersData: { users: User[]; message: string }) => {
        this.isLoading = false;
        this.users = usersData.users;
      });


  }
  ngOnDestroy() {
    this.usersSub.unsubscribe();
  }

  search(text: string) {
  }
  onLogOut() {
  }



}
