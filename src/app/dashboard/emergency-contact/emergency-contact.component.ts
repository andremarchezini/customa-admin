import { EmergencyContact } from './../../shared/models/emergency-contact';
import { ConnectService } from './../../shared/connect/connect.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { filterErrors } from '../../../util';

@Component({
  selector: 'app-emergency-contact',
  templateUrl: './emergency-contact.component.html',
  styleUrls: ['./emergency-contact.component.scss'],
})
export class EmergencyContactComponent implements OnInit {
  @Input() id: number | null = null;

  FirstName = new FormControl(null, [Validators.required, Validators.maxLength(100)]);
  LastName = new FormControl(null, [Validators.required, Validators.maxLength(100)]);
  HomePhone = new FormControl(null, [Validators.required, Validators.maxLength(11)]);
  Mobile = new FormControl(null, [Validators.required, Validators.maxLength(11)]);
  Email = new FormControl(null, [Validators.required, Validators.maxLength(100)]);
  RelationshipToPatient = new FormControl(null, [Validators.required, Validators.maxLength(100)]);
  errors: string[] = [];

  public form: FormGroup;

  loading = true;

  constructor(
    private formBuilder: FormBuilder,
    private connectSvc: ConnectService,
    private dialog: MatDialog,
  ) {
    this.form = this.formBuilder.group({
      FirstName: this.FirstName,
      LastName: this.LastName,
      HomePhone: this.HomePhone,
      Mobile: this.Mobile,
      Email: this.Email,
      RelationshipToPatient: this.RelationshipToPatient,
    });
  }

  async ngOnInit() {
    const contact = await this.connectSvc.get<EmergencyContact>(
      `EmergencyContact/${this.id}`,
      true,
    );
    this.form.setValue({
      FirstName: contact.firstName,
      LastName: contact.lastName,
      HomePhone: contact.homePhone,
      Mobile: contact.mobile,
      Email: contact.email,
      RelationshipToPatient: contact.relationshipToPatient,
    });
    console.log(this.form.value);
    this.loading = false;
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        await this.connectSvc.update(`EmergencyContact/${this.id}`, this.form.getRawValue(), true);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          title: 'Success',
          message: 'Your Emergency Contact has been updated',
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
