import { NgModule } from "@angular/core";
import { RouterModule, Routes} from "@angular/router";
import {PostListComponent} from "./posts/post-list/post-list.component";
import {PostCreateComponent} from "./posts/post-create/post-create.component";
import {LoginComponent} from "./auth/login/login.component";
import {SignupComponent} from "./auth/signup/signup.component";
import {AuthGuard} from './auth/auth.guard';
import { ForgotpasswordComponent } from "./auth/forgotpassword/forgotpassword.component";
import { ChangepasswordComponent } from "./auth/changepassword/changepassword.component";
import { PostsUserComponent } from "./posts/posts-user/posts-user.component";
import { ProfileComponent } from "./users/profile/profile.component";

const routes: Routes = [
{path:'', component: PostListComponent},
{path:'create', component: PostCreateComponent, canActivate:[AuthGuard]},
{path:'edit/:postId', component: PostCreateComponent , canActivate:[AuthGuard]},
{path:'login', component: LoginComponent},
{path:'signup', component: SignupComponent},
{path:'forgotpassword', component: ForgotpasswordComponent},
{path:'changePassword', component: ChangepasswordComponent},
{path:'postsUser', component: PostsUserComponent},
{path:'profile', component: ProfileComponent, canActivate:[AuthGuard]},





]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers:[AuthGuard]

})
export class AppRoutingModule{}