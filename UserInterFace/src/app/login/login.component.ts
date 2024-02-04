import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthorizationService } from '../services/authorization.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public isRegister: boolean = false;
  constructor(private route: ActivatedRoute,private router :Router,private authorization:AuthorizationService) {
    this.isRegister = this.route.snapshot.data['isRegister'];
  }
  userForm = new FormGroup({
    email: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required),
    passwordConfirm: new FormControl(''),
  });
  submitAllowance = () => {
    if (this.isRegister)
      return (
        this.userForm.value.email
          ?.toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ) &&
        this.userForm.value.password!.length >= 8 &&
        this.userForm.value.password == this.userForm.value.passwordConfirm
      );
    else
      return (
        this.userForm.value.email?.match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) && this.userForm.value.password!.length >= 8
      );
  };
  goToRegister():void{
    this.router.navigate(['/register'])
  }
  signInWithGoogle():void{
    this.authorization.GoogleAuth();
  }
  SubmitForm(){
    if(this.isRegister){
      this.authorization.Register(this.userForm.value.email!,this.userForm.value.password!);
    }else this.authorization.Login(this.userForm.value.email!,this.userForm.value.password!);
  }

  ngOnInit() {}
}
