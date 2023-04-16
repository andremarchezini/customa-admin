import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MapsService } from './maps.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [MapsService],
})
export class MapsModule {}
