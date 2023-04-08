import { Profile } from './../../shared/models/profile';
import { State } from './../../shared/models/state';
import { MaritalStatus } from './../../shared/models/marital-status';
import { ConnectService } from './../../shared/connect/connect.service';
import { Title } from './../../shared/models/title';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MyErrorStateMatcher } from '../../register/register.component';
import { Gender } from '../../shared/models/gender';
import { Country } from '../../shared/models/country';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { filterErrors } from '../../../util';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  get dateOfBirthError() {
    if (this.DateOfBirth.hasError('required')) {
      return 'You must select a value';
    }
    return null;
  }

  titles: Title[] = [];
  maritalStatuses: MaritalStatus[] = [];
  genders: Gender[] = [];
  states: State[] = [];
  countries: Country[] = [];
  errors: string[] = [];

  TitleId = new FormControl(null, [Validators.required]);
  FirstName = new FormControl(null, [Validators.required, Validators.maxLength(100)]);
  MiddleName = new FormControl(null, [Validators.maxLength(100)]);
  LastName = new FormControl(null, [Validators.required, Validators.maxLength(100)]);
  KnownAs = new FormControl(null, [Validators.maxLength(100)]);
  UniqueMedicalRecordNumber = new FormControl(null, [Validators.maxLength(20)]);
  MaidenName = new FormControl(null, [Validators.maxLength(100)]);
  MaritalStatusId = new FormControl(null, [Validators.required]);
  DateOfBirth = new FormControl(null, [Validators.required]);
  Gender = new FormControl(null, [Validators.required]);
  HomePhone = new FormControl(null, [Validators.required, Validators.maxLength(11)]);
  WorkPhone = new FormControl(null, [Validators.maxLength(11)]);
  Mobile = new FormControl(null, [Validators.maxLength(11)]);
  Address = new FormControl(null, [Validators.required, Validators.maxLength(100)]);
  AddressExtra = new FormControl(null, [Validators.maxLength(100)]);
  Suburb = new FormControl(null, [Validators.required, Validators.maxLength(50)]);
  StateId = new FormControl(null, [Validators.required]);
  CountryId = new FormControl({ value: 'AU', disabled: true }, [
    Validators.required,
    Validators.maxLength(3),
  ]);

  public form: FormGroup;

  matcher = new MyErrorStateMatcher();

  loading = true;

  constructor(
    private formBuilder: FormBuilder,
    private connectSvc: ConnectService,
    private dialog: MatDialog,
  ) {
    this.form = this.formBuilder.group({
      TitleId: this.TitleId,
      FirstName: this.FirstName,
      MiddleName: this.MiddleName,
      LastName: this.LastName,
      KnownAs: this.KnownAs,
      UniqueMedicalRecordNumber: this.UniqueMedicalRecordNumber,
      MaidenName: this.MaidenName,
      MaritalStatusId: this.MaritalStatusId,
      DateOfBirth: this.DateOfBirth,
      GenderId: this.Gender,
      HomePhone: this.HomePhone,
      WorkPhone: this.WorkPhone,
      Mobile: this.Mobile,
      Address: this.Address,
      AddressExtra: this.AddressExtra,
      Suburb: this.Suburb,
      StateId: this.StateId,
      CountryId: this.CountryId,
    });
  }

  async ngOnInit() {
    this.titles = await this.connectSvc.get<Title[]>('Title', false);
    this.maritalStatuses = await this.connectSvc.get<MaritalStatus[]>('MaritalStatus', false);
    this.genders = await this.connectSvc.get<Gender[]>('Gender', false);
    this.states = await this.connectSvc.get<State[]>('State', false);
    this.countries = await this.connectSvc.get<Country[]>('Country', false);
    const profile = await this.connectSvc.get<Profile>('Profile', true);
    this.form.setValue({
      TitleId: profile.title.id,
      FirstName: profile.firstName,
      MiddleName: profile.middleName,
      LastName: profile.lastName,
      KnownAs: profile.knownAs,
      UniqueMedicalRecordNumber: profile.uniqueMedicalRecordNumber,
      MaidenName: profile.maidenName,
      MaritalStatusId: profile.maritalStatus ? profile.maritalStatus.id : null,
      DateOfBirth: profile.dateOfBirth === '0001-01-01T00:00:00' ? null : profile.dateOfBirth,
      GenderId: profile.gender ? profile.gender.id : null,
      HomePhone: profile.homePhone,
      WorkPhone: profile.workPhone,
      Mobile: profile.mobile,
      Address: profile.address,
      AddressExtra: profile.addressExtra,
      Suburb: profile.suburb,
      StateId: profile.state ? profile.state.id : null,
      CountryId: 'AU',
    });

    this.loading = false;
  }

  async onSubmit() {
    this.errors = [];
    if (this.form.valid) {
      try {
        await this.connectSvc.update('Profile', this.form.getRawValue(), true);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          title: 'Success',
          message: 'Your profile has been updated',
        };
        this.dialog.open(DialogComponent, dialogConfig);
      } catch (error: any) {
        if (error.error?.errors) {
          filterErrors(error, this.errors);
        } else {
          this.connectSvc.handleError(error);
        }
      }
    }
  }

  textFieldError(control: FormControl) {
    if (control.hasError('required')) {
      return 'You must enter a value';
    }
    if (control.hasError('maxlength')) {
      return `You must enter a value no longer than ${control?.errors?.maxlength.requiredLength} characters`;
    }

    return null;
  }

  selectFieldError(control: FormControl) {
    if (control.hasError('required')) {
      return 'You must select a value';
    }
    if (control.hasError('pattern')) {
      return 'Your selection is invalid';
    }
    return null;
  }
}
