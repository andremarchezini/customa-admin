import { ConnectService } from './../shared/connect/connect.service';
import { AuthenticationService } from './../shared/authentication/authentication.service';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { PasswordValidator } from '../shared/validators/password.validator';
import { Auth } from '../shared/models/auth';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../shared/dialog/dialog.component';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent {
  get emailError() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.email.hasError('maxlength')) {
      return `You must enter a value no longer than ${this.email?.errors?.maxlength.requiredLength} characters`;
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
  get passwordError() {
    if (this.password.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.password.hasError('maxlength')) {
      return `You must enter a value no longer than ${this.password?.errors?.maxlength.requiredLength} characters`;
    }
    if (this.password.hasError('strong')) {
      return 'You must enter a stronger password with 8 characters including lower case, upper case, number and special characters';
    }
    return null;
  }

  email = new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100)]);
  password = new FormControl('', [
    Validators.required,
    PasswordValidator.strong,
    Validators.maxLength(50),
  ]);

  hide = true;

  matcher = new MyErrorStateMatcher();

  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authSvc: AuthenticationService,
    private connectSvc: ConnectService,
    private router: Router,
    public dialog: MatDialog,
  ) {
    this.form = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
  }

  getErrorMessage() {}

  async onSubmit() {
    try {
      const login = await this.connectSvc.create<Auth>(
        'authenticate/login-admin',
        this.form.value,
        false,
      );
      this.authSvc.setToken(login.token);
      this.router.navigateByUrl('/dashboard');
    } catch (error) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        title: 'Error',
        message: 'Invalid login details',
      };
      this.dialog.open(DialogComponent, dialogConfig);
    }
  }
}
