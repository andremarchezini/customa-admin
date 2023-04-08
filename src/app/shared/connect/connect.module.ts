import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { ConnectService } from './connect.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [ConnectService],
})
export class ConnectModule {}
