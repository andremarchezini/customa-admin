import { MatCardModule } from '@angular/material/card';
import { PatientRoutingModule } from './patient-routing.module';
import { PatientComponent } from './patient.component';
import { NgModule } from '@angular/core';
import { LoadingModule } from '../../shared/loading/loading.module';
import { CommonModule } from '@angular/common';
import { ProfileModule } from '../profile/profile.module';
import { HealthCardModule } from '../health-card/health-card.module';
import { ClinicianModule } from '../clinician/clinician.module';
import { EmergencyContactModule } from '../emergency-contact/emergency-contact.module';

@NgModule({
  declarations: [PatientComponent],
  imports: [
    PatientRoutingModule,
    MatCardModule,
    LoadingModule,
    CommonModule,
    ProfileModule,
    HealthCardModule,
    ClinicianModule,
    EmergencyContactModule,
  ],
})
export class PatientModule {}
