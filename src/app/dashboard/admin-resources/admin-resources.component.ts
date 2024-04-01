import { EmergencyContact } from '../../shared/models/emergency-contact';
import { ConnectService } from '../../shared/connect/connect.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { filterErrors } from '../../../util';
import { ProfileAdminResources } from 'src/app/shared/models/profile-admin-resources';

@Component({
  selector: 'app-admin-resources',
  templateUrl: './admin-resources.component.html',
  styleUrls: ['./admin-resources.component.scss'],
})
export class AdminResourcesComponent implements OnInit {
  @Input() id: number | null = null;

  FolderLink = new FormControl(null, [Validators.maxLength(500)]);
  errors: string[] = [];

  public form: FormGroup;

  loading = true;

  constructor(
    private formBuilder: FormBuilder,
    private connectSvc: ConnectService,
    private dialog: MatDialog,
  ) {
    this.form = this.formBuilder.group({
      FolderLink: this.FolderLink,
    });
  }

  async ngOnInit() {
    if (!this.id) {
      this.loading = false;
      return;
    }
    const resources = await this.connectSvc.get<ProfileAdminResources>(
      `ProfileAdminResources/${this.id}`,
      true,
    );
    this.form.setValue({
      FolderLink: resources.folderLink,
    });
    this.loading = false;
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        await this.connectSvc.update(
          `ProfileAdminResources/${this.id}`,
          this.form.getRawValue(),
          true,
        );
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          title: 'Success',
          message: 'The data has been updated',
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

  openPath() {
    if (this.FolderLink.value) window.open(this.FolderLink.value, '_blank');
  }
}
