import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthorizationService } from '../services/authorization.service';
import { FormType } from 'src/Types/enums/formType.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public formType: FormType;
  public messageType: 'error' | 'success' = 'error';
  public message: string = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authorization: AuthorizationService
  ) {
    this.formType = this.route.snapshot.data['isRegister'];
  }
  userForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    passwordConfirm: new FormControl(''),
  });
  submitAllowance = () => {
    if (this.formType == FormType.register)
      return (
        this.userForm.value.email
          ?.toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ) &&
        this.userForm.value.password!.length >= 8 &&
        this.userForm.value.password == this.userForm.value.passwordConfirm
      );
    else if (this.formType == FormType.login)
      return (
        this.userForm.value.email?.match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) && this.userForm.value.password!.length >= 8
      );
    else
      return this.userForm.value.email?.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  goToAnotherForm(formMode:number): void {
    if(formMode==FormType.login)
    this.router.navigate(['/register']);
    else if(formMode==FormType.resetPassword)
    this.router.navigate(['/resetPassword']);
    else
    this.router.navigate(['/login']);


  }
  signInWithGoogle(): void {
    this.authorization.GoogleAuth();
  }
  SubmitForm() {
    if (this.formType == FormType.register) {
      this.authorization
        .Register(this.userForm.value.email!, this.userForm.value.password!)
        .catch(() => (this.message = 'User exists'));
    } else if (this.formType == FormType.login)
      this.authorization
        .Login(this.userForm.value.email!, this.userForm.value.password!)
        .catch(() => (this.message = 'Email or Password is not correct'));
    else
      this.authorization
        .sendPasswordResetEmails(this.userForm.value.email!)
        .catch(() => (this.message = 'Email Does not Exist'))
        .then(() => {
          this.message = 'Password reset email sent, check your inbox.';
          this.messageType = 'success';
        });
  }
  ngOnInit() {}
}
