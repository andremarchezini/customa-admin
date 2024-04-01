import { expire } from '../../shared/validators/medicare.validator';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { AccountType } from '../../shared/models/account-type';
import { DvaCardColour } from '../../shared/models/dva-card-colour';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConnectService } from '../../shared/connect';
import { HealthCard } from '../../shared/models/health-card';
import {
  DateAdapter,
  ErrorStateMatcher,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { filterErrors } from '../../../util';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-health-card',
  templateUrl: './health-card.component.html',
  styleUrls: ['./health-card.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class HealthCardComponent {
  @Input() id: number | null = null;

  get medicareExpiryError() {
    if (this.MedicareExpiry.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.MedicareExpiry.hasError('maxlength')) {
      return `You must enter a value no longer than ${this.MedicareExpiry?.errors?.maxlength.requiredLength} characters`;
    }
    if (this.MedicareExpiry.hasError('date')) {
      return 'You must enter a valid date';
    }
    if (this.MedicareExpiry.hasError('expired')) {
      return `You must enter a date greater than today's`;
    }
    return null;
  }

  accountTypes: AccountType[] = [];
  dvaCardColours: DvaCardColour[] = [];

  AccountTypeId = new FormControl(null, [Validators.required]);
  AccountHolderName = new FormControl(null, [Validators.required, Validators.maxLength(100)]);
  Balance = new FormControl(null, [Validators.maxLength(50)]);
  IhiNumber = new FormControl(null, [Validators.maxLength(20)]);
  IhiRecordStatus = new FormControl(null, [Validators.maxLength(50)]);
  MedicareNumber = new FormControl(null, [Validators.maxLength(20)]);
  MedicareExpiry = new FormControl<_moment.Moment | null>(null, [
    Validators.maxLength(7),
    expire(),
  ]);
  PrivateFundName = new FormControl(null, [Validators.maxLength(50)]);
  PrivateFundMembershipNumber = new FormControl(null, [Validators.maxLength(20)]);
  DvaNumber = new FormControl(null, [Validators.maxLength(50)]);
  DvaDisability = new FormControl(null, [Validators.maxLength(50)]);
  DvaCardColourId = new FormControl(null, []);
  HccPensionCardNumber = new FormControl(null, [Validators.maxLength(20)]);
  errors: string[] = [];

  public form: FormGroup;

  matcher = new MyErrorStateMatcher();

  loading = true;

  constructor(
    private formBuilder: FormBuilder,
    private connectSvc: ConnectService,
    private dialog: MatDialog,
  ) {
    this.form = this.formBuilder.group({
      AccountTypeId: this.AccountTypeId,
      AccountHolderName: this.AccountHolderName,
      Balance: this.Balance,
      IhiNumber: this.IhiNumber,
      IhiRecordStatus: this.IhiRecordStatus,
      MedicareNumber: this.MedicareNumber,
      MedicareExpiry: this.MedicareExpiry,
      PrivateFundName: this.PrivateFundName,
      PrivateFundMembershipNumber: this.PrivateFundMembershipNumber,
      DvaNumber: this.DvaNumber,
      DvaDisability: this.DvaDisability,
      DvaCardColourId: this.DvaCardColourId,
      HccPensionCardNumber: this.HccPensionCardNumber,
    });
  }

  async ngOnInit() {
    if (!this.id) {
      this.loading = false;
      return;
    }
    this.dvaCardColours = await this.connectSvc.get<DvaCardColour[]>('DvaCardColour', false);
    this.accountTypes = await this.connectSvc.get<AccountType[]>('AccountType', false);
    const card = await this.connectSvc.get<HealthCard>(`HealthCard/${this.id}`, true);
    this.form.setValue({
      AccountTypeId: card.accountType ? card.accountType.id : null,
      AccountHolderName: card.accountHolderName,
      Balance: card.balance,
      IhiNumber: card.ihiNumber,
      IhiRecordStatus: card.ihiRecordStatus,
      MedicareNumber: card.medicareNumber,
      MedicareExpiry: card.medicareExpiry ? _moment(card.medicareExpiry) : null,
      PrivateFundName: card.privateFundName,
      PrivateFundMembershipNumber: card.privateFundMembershipNumber,
      DvaNumber: card.dvaNumber,
      DvaDisability: card.dvaDisability,
      DvaCardColourId: card.dvaCardColour ? card.dvaCardColour.id : null,
      HccPensionCardNumber: card.hccPensionCardNumber,
    });
    this.loading = false;
  }

  async onSubmit() {
    const value = this.form.getRawValue();
    if (value.MedicareExpiry) value.MedicareExpiry = value.MedicareExpiry.toISOString();

    if (this.form.valid) {
      try {
        await this.connectSvc.update(`HealthCard/${this.id}`, this.form.getRawValue(), true);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          title: 'Success',
          message: 'The Health Card information has been updated',
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

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    this.MedicareExpiry.setValue(normalizedMonthAndYear);
    datepicker.close();
  }
}
