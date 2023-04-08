import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullRoutingModule } from './full-routing.module';
import { FullComponent } from './full.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { VerticalAppHeaderModule } from './vertical-header/vertical-header.module';
import { VerticalAppSidebarModule } from './vertical-sidebar/vertical-sidebar.module';
import { BidiModule } from '@angular/cdk/bidi';

@NgModule({
  declarations: [FullComponent],
  imports: [
    CommonModule,
    FullRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatSlideToggleModule,
    MatListModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    VerticalAppHeaderModule,
    VerticalAppSidebarModule,
    PerfectScrollbarModule,
    BidiModule,
  ],
})
export class FullModule {}
