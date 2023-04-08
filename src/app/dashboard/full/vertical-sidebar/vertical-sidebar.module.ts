import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { VerticalAppSidebarComponent } from './vertical-sidebar.component';
import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [VerticalAppSidebarComponent],
  imports: [
    MatListModule,
    MatMenuModule,
    MatIconModule,
    CommonModule,
    MatButtonModule,
    TranslateModule,
    FlexLayoutModule,
    CdkAccordionModule,
    SharedModule,
    RouterModule,
  ],
  exports: [VerticalAppSidebarComponent],
})
export class VerticalAppSidebarModule {}
