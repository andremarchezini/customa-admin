import { MatButtonModule } from '@angular/material/button';
import { IConfig } from './../../node_modules/ngx-mask/lib/config.d';
import { MatMenuModule } from '@angular/material/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { SharedModule } from './shared/shared.module';
// import { mailService, mailGlobalVariable } from './apps/mailbox/mail.service';
// import { FullComponent } from './dashboard/full/full.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthenticationModule } from './shared/authentication';
import { ConnectModule } from './shared/connect';
import { DialogComponent } from './shared/dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { QuestionDialogComponent } from './shared/question-dialog/question-dialog.component';
import { ExpiredTokenInterceptor } from './shared/interceptors/expired-token.interceptor';
import { MapsModule } from './shared/maps/maps.module';

export function HttpLoaderFactory(http: HttpClient): any {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
};

const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: true,
  };
};

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
    QuestionDialogComponent,
    // // FullComponent,
    // VerticalAppHeaderComponent,
    // // SpinnerComponent,
    // // AppBlankComponent,
    // VerticalAppSidebarComponent,
    // // AppBreadcrumbComponent,
    // HorizontalAppHeaderComponent,
    // HorizontalAppSidebarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    // DemoMaterialModule,
    OverlayModule,
    MatMenuModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    PerfectScrollbarModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AuthenticationModule,
    ConnectModule,
    MapsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    { provide: HTTP_INTERCEPTORS, useClass: ExpiredTokenInterceptor, multi: true },

    // mailService,
    // mailGlobalVariable,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
