import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'contracts',
    loadComponent: () =>
      import('./pages/contracts/contracts.component').then(
        (m) => m.ContractsComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'data',
    loadComponent: () =>
      import('./pages/data/data.component').then((m) => m.DataComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'login/success',
    loadComponent: () =>
      import('./pages/login/pages/success/success.component').then(
        (m) => m.SuccessComponent
      ),
  },
];
