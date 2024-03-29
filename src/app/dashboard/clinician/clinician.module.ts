import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMaskModule } from 'ngx-mask';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ClinicianRoutingModule } from './clinician-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import { ClinicianComponent } from './clinician.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule, MatRippleModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LoadingModule } from '../../shared/loading/loading.module';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';

@NgModule({
  declarations: [ClinicianComponent],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    ClinicianRoutingModule,
    MatNativeDateModule,
    MatRippleModule,
    MatDatepickerModule,
    CommonModule,
    FlexLayoutModule,
    NgxMaskModule.forRoot(),
    LoadingModule,
    NgxMatIntlTelInputComponent,

  ],
  exports: [ClinicianComponent],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-AU' }],
})
export class ClinicianModule {}
