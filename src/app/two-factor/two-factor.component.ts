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

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-two-factor',
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.sass'],
})
export class TwoFactorComponent implements OnInit {
  get codeError() {
    if (this.code.hasError('required')) {
      return 'You must enter a value';
    }
  }
  code = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();

  public form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      code: this.code,
    });
  }

  //TODO

  ngOnInit(): void {}

  getErrorMessage() {}

  onSubmit(): void {
    alert('submitted');
  }
}
