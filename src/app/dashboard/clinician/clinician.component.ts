import { Component, Input } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConnectService } from '../../shared/connect';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { Clinician } from '../../shared/models/clinician';
import { Country } from '../../shared/models/country';
import { State } from '../../shared/models/state';
import { filterErrors } from '../../../util';
import { ErrorStateMatcher } from '@angular/material/core';
import { MapsService } from '../../shared/maps/maps.service';
import { Place, PlaceSearch } from '../../shared/models/maps';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-clinician',
  templateUrl: './clinician.component.html',
  styleUrls: ['./clinician.component.scss'],
})
export class ClinicianComponent {
  @Input() id: number | null = null;

  FirstName = new FormControl(null, [Validators.required, Validators.maxLength(100)]);
  LastName = new FormControl(null, [Validators.required, Validators.maxLength(100)]);
  ProviderNumber = new FormControl(null, [Validators.required, Validators.maxLength(20)]);
  PracticeName = new FormControl(null, [Validators.required, Validators.maxLength(100)]);
  Address = new FormControl<null | string>(null, [Validators.required, Validators.maxLength(100)]);
  AddressExtra = new FormControl<null | string>(null, [Validators.maxLength(100)]);
  Suburb = new FormControl<null | string>(null, [Validators.required, Validators.maxLength(50)]);
  StateId = new FormControl<null | string>(null, [Validators.required, Validators.maxLength(3)]);
  CountryId = new FormControl({ value: 'AU', disabled: true }, [
    Validators.required,
    Validators.maxLength(3),
  ]);
  PracticePhone = new FormControl(null, [Validators.required, Validators.maxLength(11)]);
  PracticeEmail = new FormControl(null, [Validators.required, Validators.maxLength(100)]);
  PracticeUrl = new FormControl(null, [Validators.required, Validators.maxLength(100)]);

  states: State[] = [];
  countries: Country[] = [];
  errors: string[] = [];
  places: PlaceSearch[] = [];

  matcher = new MyErrorStateMatcher();

  loading = true;

  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private connectSvc: ConnectService,
    private dialog: MatDialog,
    private mapsService: MapsService,
  ) {
    this.form = this.formBuilder.group({
      FirstName: this.FirstName,
      LastName: this.LastName,
      ProviderNumber: this.ProviderNumber,
      PracticeName: this.PracticeName,
      Address: this.Address,
      AddressExtra: this.AddressExtra,
      Suburb: this.Suburb,
      StateId: this.StateId,
      CountryId: this.CountryId,
      PracticePhone: this.PracticePhone,
      PracticeEmail: this.PracticeEmail,
      PracticeUrl: this.PracticeUrl,
    });
  }

  async ngOnInit() {
    this.states = await this.connectSvc.get<State[]>('State', false);
    this.countries = await this.connectSvc.get<Country[]>('Country', false);
    const clinician = await this.connectSvc.get<Clinician>(`Clinician/${this.id}`, true);
    this.form.setValue({
      FirstName: clinician.firstName,
      LastName: clinician.lastName,
      ProviderNumber: clinician.providerNumber,
      PracticeName: clinician.practiceName,
      Address: clinician.address,
      AddressExtra: clinician.addressExtra,
      Suburb: clinician.suburb,
      StateId: clinician.state ? clinician.state.id : null,
      CountryId: clinician.country ? clinician.country.id : null,
      PracticePhone: clinician.practicePhone,
      PracticeEmail: clinician.practiceEmail,
      PracticeUrl: clinician.practiceUrl,
    });
    this.loading = false;
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        await this.connectSvc.update(`Clinician/${this.id}`, this.form.getRawValue(), true);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          title: 'Success',
          message: 'The Clinician has been updated',
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
      if (place.countryId == 'AU') {
        this.Address.setValue(place.address);
        this.AddressExtra.setValue(null);
        this.Suburb.setValue(place.suburb);
        this.StateId.setValue(place.stateId);
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
