import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ErrorComponent } from './error.component';
import { ErrorRoutingModule } from './error-routing.module';
@NgModule({
  declarations: [ErrorComponent],
  imports: [RouterModule, ErrorRoutingModule, MatButtonModule],
})
export class ErrorModule {}
