import { Injectable, NgZone } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  User,
  AuthProvider
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  UserData : any;
  user$ = new BehaviorSubject<User | null>(null); // Create a BehaviorSubject
  authSituation$ = new BehaviorSubject<string | null>(null); // Create a BehaviorSubject

  constructor(private auth: Auth,private router : Router, public ngZone: NgZone){
    onAuthStateChanged(this.auth,(user: any)=>{
      if(user){
        this.UserData = user;
        localStorage.setItem('user', JSON.stringify(this.UserData));
        JSON.parse(localStorage.getItem('user')!);
        this.emitEvent('ChangeUser');

      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
        this.emitEvent('signOut');

      }
      this.user$.next(this.UserData); // Emit the current user
    })
  }
  emitEvent(data: any) {
    this.authSituation$.next(data);
  }

  getEvent() {
    return this. authSituation$.asObservable();
  }

  //get User
  //get Authenticated user from firebase
  getAuthFire(){
    return this.auth.currentUser;
  }



    //get Authenticated user from Local Storage
    getAuthLocal(){
      const token = localStorage.getItem('user')
      const user = JSON.parse(token as string);
      return user;
    }

    getToken(){
      const token = localStorage.getItem('user')
      const user = JSON.parse(token as string);
      return user.stsTokenManager.accessToken;
    }
    //Check wither User Is looged in or not
    get isLoggedIn(): boolean {
      const token = localStorage.getItem('user')
      const user = JSON.parse(token as string);
      return user !== null ? true : false;
    }


    //Register Method
     Register(email : string, password : string) {
      return createUserWithEmailAndPassword(this.auth, email, password)
      .then((result) => {
        this.UserData = result.user;
        this.ngZone.run(async () => {
           /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
          await this.sendEmailVerification()
          this.router.navigate(['/dashboard/inbox']);
        });
      })
      .catch((error) => {
        throw new Error(error)
      });
    }


    //Login Method
    Login(email : string, password : string){
      return signInWithEmailAndPassword(this.auth, email, password)
      .then((result: any) => {
        this.UserData = result.user;
        this.ngZone.run(() => {
          this.router.navigate(['/dashboard/inbox']);
        });
      })
      .catch((error) => {
        throw new Error(error)
      });
    }

 
   //Logout
    Logout() {
      localStorage.removeItem('user'); // Clear user data from local storage
      signOut(this.auth).then(()=>this.router.navigate(['/login']))
    }


  //login with Email or Facebook
    //Login with Google
    GoogleAuth() {
      return this.loginWithPopup(new GoogleAuthProvider());
    }



    //Login with Facebook
    //FacebookAuth() {
    //  return this.loginWithPopup(new FacebookAuthProvider());
    //}



    //Pop Up Provider
    loginWithPopup(provider :AuthProvider) {
      return signInWithPopup(this.auth,provider).then(() => {
        this.router.navigate(['dashboard/inbox']);
      });
    }


    //Send Password Reset Email
    async sendPasswordResetEmails(email : string){
       sendPasswordResetEmail(this.auth,email)
       .then(() => {
       })
       .catch((error) => {
        throw new Error(error)
      });
    }

    //Send Email Verification
    sendEmailVerification(){
      return sendEmailVerification(this.auth.currentUser as User );
    }
}