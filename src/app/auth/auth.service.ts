import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData, LoginData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { User } from './user.model';
import { map } from "rxjs/operators";

const BACKEND_URL = environment.apiURL + "user";

@Injectable({ providedIn: "root" })
export class AuthService {

  private reseatLink = "null";

  private users: User[] = [];
  private profile: User;

  private userUpdated = new Subject<{ users: User[] }>();
  private profileUpdated = new Subject<{ user: User }>();
  private userId: string;
  private username: string;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private passwordListener = new Subject<boolean>();
  private tokenTimer: any;
  isAuth = false;
  constructor(private http: HttpClient, private router: Router) {

  }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getPasswordListener() {
    return this.passwordListener.asObservable();
  }
  updateUser(country: string, imagePath: File | string) {
    const userId = localStorage.getItem("userId");
    let obj: FormData | any;
    obj = new FormData();
    if (typeof (imagePath) === 'object') {
      obj = new FormData();
      obj.append("userId", userId);
      obj.append("country", country);
      obj.append("image", imagePath, "foto");

    } else {
      obj = { userId: userId, country: country, imagePath: imagePath }
    }

    return this.http.put<{ message: string, user: any }>(BACKEND_URL + "/updateUser", obj);
  }
  createUser(email: string, password: string, user: string, country: string) {
    const authData: AuthData = { email: email, password: password, user: user, country: country };
    this.http.post(BACKEND_URL + "/signup", authData).subscribe(response => {
      this.router.navigate(['/']);
    }, error => {
      this.authStatusListener.next(false);
    })
  }
  getUserId() {
    return localStorage.getItem("userId");
  }

  getUsername() {
    return this.username;
  }
  getResetLink() {

    return localStorage.getItem("reseatLink");
  }
  getUsers() {
    this.http.get<{ message: string; users: any; }>(
      BACKEND_URL + "/getUsers"
    )
      .pipe(
        map(usersData => {
          return {
            users: usersData.users.map(user => {
              return {
                id: user._id,
                email: user.email,
                username: user.username,
                country: user.country,
                imagePath: user.imagePath
              };
            }),
          };
        })
      )
      .subscribe(transformedPostData => {
        this.users = transformedPostData.users;
        this.userUpdated.next({
          users: [...this.users]
        });
      });

  }

  getSingleUser(userId: string) {
    const obj = new Object({ userId: userId });
    return this.http.post<{ message: string; user: any; }>(
      BACKEND_URL + "/getUser", obj
    );

  }
  getProfile() {
    const userId = localStorage.getItem('userId');
    const obj = new Object({ userId: userId });
    this.http.post<{ message: string; user: any; }>(
      BACKEND_URL + "/getUser", obj
    )
      .subscribe(response => {
        this.profile = { id: response.user._id, email: response.user.email, username: response.user.username, country: response.user.country, imagePath: response.user.imagePath };
        this.profileUpdated.next({
          user: this.profile
        });
      });

  }



  getUserUpdateListener() {
    return this.userUpdated.asObservable();
  }

  getProfileUpdateListener() {
    return this.profileUpdated.asObservable();
  }

  login(email: string, password: string) {
    this.getUsers();
    const authData: LoginData = { email: email, password: password };
    this.http.post<{ token: string, expiresIn: number, userId: string, username: string, imagePath: string }>(BACKEND_URL + "/login", authData).subscribe(response => {
      console.log(response);
      const token = response.token;
      const userId = response.userId;
      const username = response.username;
      const imagePath = response.imagePath;

      this.token = token;
      if (token && userId && username) {
        const expiresTime = response.expiresIn;
        this.setAuthTimer(expiresTime);
        console.log(expiresTime);
        this.userId = userId;
        this.isAuth = true
        this.username = username;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresTime * 1000);
        console.log(expirationDate);
        this.saveAuthData(token, expirationDate, userId, username, imagePath);//save user data in localstorage
        this.router.navigate(['/']);

      }

    }, error => {
      this.authStatusListener.next(false);
    });
  }

  getIsAuth() {
    return this.isAuth;
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    };
    const now = new Date();
    const expiresTime = authInformation.expirationDate.getTime() - now.getTime();
    console.log("expiration::::" + authInformation + " --- " + expiresTime);
    if (expiresTime > 0) {
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.username = authInformation.username;
      this.isAuth = true;
      this.setAuthTimer(expiresTime / 1000);
      this.authStatusListener.next(true);

    }
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const imagePath = localStorage.getItem("imagePath");

    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      username: username,
      imagePath: imagePath
    }
  }

  logOut() {

    this.token = null;
    this.isAuth = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/login']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => { this.logOut(); }, duration * 1000); // setTimeout trabaja con milisegundos por eso multiplicamos 
    // la cantidad de segundos que nos lanza node.js * 1000 , al mismo tiempo ejecutamos la funcion logout() despues del tiempo expirado

  }
  private saveAuthData(token: string, expirationDate: Date, userId: string, username: string, imagePath: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    localStorage.setItem('imagePath', imagePath);

  }
  clearLink() {
    this.clearPasswordToken();

  }
  private clearPasswordToken() {
    localStorage.removeItem('reseatLink');
    this.passwordListener.next(false);

  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('imagePath');


  }

  forgotPassword(email: string) {
    const authData: Object = { email: email };
    return this.http.put<{ reseatLink: string, message: string }>(BACKEND_URL + "/forgotPassword", authData);
  }

  setReseatLink(link: string) {
    this.reseatLink = link;
    localStorage.setItem('reseatLink', link);
    this.passwordListener.next(true);
  }

  resetPassword(reseatLink: string, newPass: string) {
    return this.http.put<{ reseatLink: string, message: string }>(BACKEND_URL + "/resetPassword", { reseatLink: reseatLink, newPass: newPass });
  }


}