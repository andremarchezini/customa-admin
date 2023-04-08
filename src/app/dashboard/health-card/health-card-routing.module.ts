import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HealthCardComponent } from './health-card.component';

const routes: Routes = [{ path: '', component: HealthCardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthCardRoutingModule {}
