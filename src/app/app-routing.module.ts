import { EmergencyContactRoutingModule } from './dashboard/emergency-contact/emergency-contact-routing.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullComponent } from './dashboard/full/full.component';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then((m) => m.RegisterModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'forgot',
    loadChildren: () => import('./forgot/forgot.module').then((m) => m.ForgotModule),
  },
  {
    path: 'two-factor',
    loadChildren: () => import('./two-factor/two-factor.module').then((m) => m.TwoFactorModule),
  },
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard/home',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        redirectTo: '/dashboard/home',
        pathMatch: 'full',
      },
      {
        path: 'dashboard/home',
        loadChildren: () => import('./dashboard/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'dashboard/profile',
        loadChildren: () =>
          import('./dashboard/profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'dashboard/emergency-contact',
        loadChildren: () =>
          import('./dashboard/emergency-contact/emergency-contact.module').then(
            (m) => m.EmergencyContactModule,
          ),
      },
      {
        path: 'dashboard/health-card',
        loadChildren: () =>
          import('./dashboard/health-card/health-card.module').then((m) => m.HealthCardModule),
      },
      {
        path: 'dashboard/clinician',
        loadChildren: () =>
          import('./dashboard/clinician/clinician.module').then((m) => m.ClinicianModule),
      },
    ],
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/full/full.module').then((m) => m.FullModule),
  },

  {
    path: '**',
    loadChildren: () => import('./error/error.module').then((m) => m.ErrorModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
