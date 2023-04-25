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
import { ConnectService } from '../shared/connect';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { Router } from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.sass'],
})
export class ForgotComponent {
  get emailError() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
  email = new FormControl('', [Validators.required, Validators.email]);
  origin = new FormControl(1, [Validators.required]);

  matcher = new MyErrorStateMatcher();
  errors: string[] = [];

  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private connectSvc: ConnectService,
    private router: Router,
  ) {
    this.form = this.formBuilder.group({
      email: this.email,
      origin: this.origin,
    });
  }

  async onSubmit() {
    try {
      await this.connectSvc.create('authenticate/forgot', this.form.value, false);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        title: 'Sent',
        message:
          "An email with the resent link has been sent. If you don't receive it please check the email address.",
      };
      const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigateByUrl('/login');
      });
    } catch (error: any) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        title: 'Error',
        message: 'Something went wrong. Please try again.',
      };
      this.dialog.open(DialogComponent, dialogConfig);
    }
  }
}
