import { MatCardModule } from '@angular/material/card';
import { PatientsRoutingModule } from './patients-routing.module';
import { PatientsComponent } from './patients.component';
import { NgModule } from '@angular/core';
import { LoadingModule } from '../../shared/loading/loading.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [PatientsComponent],
  imports: [
    PatientsRoutingModule,
    MatCardModule,
    LoadingModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
  ],
})
export class PatientsModule {}
