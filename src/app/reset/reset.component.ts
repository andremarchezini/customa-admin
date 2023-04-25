import { Component, OnInit } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { strong } from '../shared/validators/password.validator';
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
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.sass'],
})
export class ResetComponent implements OnInit {
  get emailError() {
    if (this.Email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.Email.hasError('email') ? 'Not a valid email' : '';
  }
  get passwordError() {
    if (this.Password.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.Password.hasError('strong')) {
      return 'You must enter a stronger password with 8 characters including lower case, upper case, number and special characters';
    }
    if (this.Password.hasError('maxlength')) {
      return `You must enter a value no longer than ${this.Password?.errors?.maxlength.requiredLength} characters`;
    }
    return null;
  }

  hide = true;
  Email = new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]);
  Password = new FormControl('', [Validators.required, strong(), Validators.maxLength(100)]);

  token: string | null = null;
  matcher = new MyErrorStateMatcher();
  errors: string[] = [];

  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private connectSvc: ConnectService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.form = this.formBuilder.group({
      Email: this.Email,
      Password: this.Password,
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.Email.setValue(params.email);
      this.token = params.token.replaceAll(' ', '+');
    });
  }

  async onSubmit() {
    const value = { ...this.form.getRawValue(), token: this.token };
    try {
      await this.connectSvc.create('authenticate/reset', value, false);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        title: 'Success',
        message: 'Your password has been updated',
      };
      const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigateByUrl('/login');
      });
    } catch (error: any) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        title: 'Error',
        message: 'Your token is invalid or it has expired. Please try again.',
      };
      this.dialog.open(DialogComponent, dialogConfig);
    }
  }
}
