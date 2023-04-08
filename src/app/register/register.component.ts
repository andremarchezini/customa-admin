import { ConnectService } from './../shared/connect/connect.service';
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
import { PasswordValidator } from '../shared/validators/password.validator';
import { Title } from '../shared/models/title';
import { RecoveryQuestion } from '../shared/models/recovery-question';
import { filterErrors } from '../../util';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  get titleError() {
    if (this.TitleId.hasError('required')) {
      return 'You must select a value';
    }
    if (this.TitleId.hasError('pattern')) {
      return 'Your selection is invalid';
    }
    return null;
  }
  get firstNameError() {
    if (this.FirstName.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.FirstName.hasError('maxlength')) {
      return `You must enter a value no longer than ${this.FirstName?.errors?.maxlength.requiredLength} characters`;
    }

    return null;
  }
  get middleNameError() {
    if (this.MiddleName.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.MiddleName.hasError('maxlength')) {
      return `You must enter a value no longer than ${this.MiddleName?.errors?.maxlength.requiredLength} characters`;
    }
    return null;
  }
  get lastNameError() {
    if (this.LastName.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.LastName.hasError('maxlength')) {
      return `You must enter a value no longer than ${this.LastName?.errors?.maxlength.requiredLength} characters`;
    }
    return null;
  }
  get emailError() {
    if (this.Email.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.Email.hasError('maxlength')) {
      return `You must enter a value no longer than ${this.Email?.errors?.maxlength.requiredLength} characters`;
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

  TitleId = new FormControl('', [Validators.required]);
  FirstName = new FormControl('', [Validators.required, Validators.maxLength(100)]);
  MiddleName = new FormControl('', [Validators.maxLength(100)]);
  LastName = new FormControl('', [Validators.required, Validators.maxLength(100)]);
  Email = new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100)]);
  Password = new FormControl('', [
    Validators.required,
    PasswordValidator.strong,
    Validators.maxLength(100),
  ]);

  titles: Title[] = [];
  hide = true;
  errors: string[] = [];

  matcher = new MyErrorStateMatcher();

  public form: FormGroup;

  constructor(private formBuilder: FormBuilder, private connectSvc: ConnectService) {
    this.form = this.formBuilder.group({
      TitleId: this.TitleId,
      FirstName: this.FirstName,
      LastName: this.LastName,
      Email: this.Email,
      Password: this.Password,
    });
  }

  async ngOnInit() {
    this.titles = await this.connectSvc.get<Title[]>('Title', false);
  }

  getErrorMessage() {}

  async onSubmit() {
    console.log(this.form.value);
    try {
      await this.connectSvc.create('authenticate/register', this.form.value, false);
    } catch (error: any) {
      if (error.error?.errors) {
        filterErrors(error, this.errors);
      } else {
        this.connectSvc.handleError(error);
      }
    }
  }
}
