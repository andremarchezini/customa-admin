import { Profile } from './../../shared/models/profile';
import { MaritalStatus } from './../../shared/models/marital-status';
import { ConnectService } from './../../shared/connect/connect.service';
import { Title } from './../../shared/models/title';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { Gender } from '../../shared/models/gender';
import { Country } from '../../shared/models/country';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { filterErrors } from '../../../util';
import { ErrorStateMatcher } from '@angular/material/core';
import { MapsService } from '../../shared/maps/maps.service';
import { Place, PlaceSearch } from '../../shared/models/maps';
import { ALLOWED_COUNTRIES } from 'src/global';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @Input() id: number | null = null;

  get dateOfBirthError() {
    if (this.DateOfBirth.hasError('required')) {
      return 'You must select a value';
    }
    return null;
  }

  titles: Title[] = [];
  maritalStatuses: MaritalStatus[] = [];
  genders: Gender[] = [];
  countries: Country[] = [];
  errors: string[] = [];
  places: PlaceSearch[] = [];

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
  HomePhone = new FormControl(null, [Validators.maxLength(50)]);
  WorkPhone = new FormControl(null, [Validators.maxLength(50)]);
  Mobile = new FormControl(null, [Validators.required, Validators.maxLength(50)]);
  Address = new FormControl<null | string>(null, [Validators.required, Validators.maxLength(100)]);
  AddressExtra = new FormControl<null | string>(null, [Validators.maxLength(100)]);
  Suburb = new FormControl<null | string>(null, [Validators.required, Validators.maxLength(50)]);
  State = new FormControl<null | string>(null, [Validators.required]);
  CountryId = new FormControl<null | string>(null, [Validators.required, Validators.maxLength(3)]);

  public form: FormGroup;

  matcher = new MyErrorStateMatcher();

  loading = true;

  constructor(
    private formBuilder: FormBuilder,
    private connectSvc: ConnectService,
    private dialog: MatDialog,
    private mapsService: MapsService,
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
      State: this.State,
      CountryId: this.CountryId,
    });
  }

  async ngOnInit() {
    this.titles = await this.connectSvc.get<Title[]>('Title', false);
    this.maritalStatuses = await this.connectSvc.get<MaritalStatus[]>('MaritalStatus', false);
    this.genders = await this.connectSvc.get<Gender[]>('Gender', false);
    this.countries = await this.connectSvc.get<Country[]>('Country', false);
    const profile = await this.connectSvc.get<Profile>(`Profile/${this.id}`, true);
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
      State: profile.state,
      CountryId: profile.country ? profile.country.id : null,
    });

    this.loading = false;
  }

  async onSubmit() {
    this.errors = [];
    if (this.form.valid) {
      try {
        await this.connectSvc.update(`Profile/${this.id}`, this.form.getRawValue(), true);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          title: 'Success',
          message: 'The profile has been updated',
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
    if (control.hasError('validatePhoneNumber')) {
      return 'You must enter a valid number';
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

  async search() {
    const places = await this.mapsService.search(this.Address.value!);
    if (places) this.places = places;
    else this.places = [];
    console.log(this.places);
  }

  async getPlace(placeId: string) {
    this.places = [];
    const place = await this.mapsService.getPlace(placeId);
    this.setPlace(place);
  }

  setPlace(place: Place) {
    if (place) {
      if (ALLOWED_COUNTRIES.indexOf(place.countryId) > -1) {
        this.Address.setValue(place.address);
        this.AddressExtra.setValue(null);
        this.Suburb.setValue(place.suburb);
        this.State.setValue(place.state);
        this.CountryId.setValue(place.countryId);
      } else {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          title: 'Error',
          message: 'Country not allowed',
        };
        this.dialog.open(DialogComponent, dialogConfig);
      }
    }
  }
}
