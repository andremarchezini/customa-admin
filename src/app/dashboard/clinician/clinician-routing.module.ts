import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClinicianComponent } from './clinician.component';

const routes: Routes = [{ path: '', component: ClinicianComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClinicianRoutingModule {}
