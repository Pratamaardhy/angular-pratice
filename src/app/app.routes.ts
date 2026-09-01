import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './features/dashboard/layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guards';

export const routes: Routes = [
  // =========================================================================
  // 1. HALAMAN PUBLIK (Tanpa Sidebar & Topbar Layout Admin)
  // =========================================================================
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },

  // =========================================================================
  // 2. HALAMAN TERPROTEKSI (Dengan Layout Admin & AuthGuard)
  // =========================================================================
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'pengajuan-pinjaman',
        loadComponent: () =>
          import('./features/loan-application/loan-application-list.component').then(
            (m) => m.LoanApplicationListComponent,
          ),
      },
      {
        path: 'pengguna',
        loadComponent: () =>
          import('./features/pengguna/pengguna.component').then((m) => m.PenggunaComponent),
      },
      {
        path: 'rbac',
        loadComponent: () => import('./features/rbac/rbac.component').then((m) => m.RbacComponent),
      },
      {
        path: 'marketing',
        loadComponent: () =>
          import('./features/marketing/marketing.component').then((m) => m.MarketingQueueComponent),
      },
      {
        path: 'bm-approval',
        loadComponent: () =>
          import('./features/branch-manager/bm-approval.component').then(
            (m) => m.BmApprovalComponent,
          ),
      },
      {
        path: 'back-office',
        loadComponent: () =>
          import('./features/back-office/back-office.component').then((m) => m.BackOfficeComponent),
      },
    ],
  },

  // =========================================================================
  // 3. FALLBACK ROUTE (Not Found / Redirect)
  // =========================================================================
  {
    path: '**',
    redirectTo: '',
  },
];
