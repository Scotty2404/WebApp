import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { AuthGuard } from './core/guards/auth.guard'

export const routes: Routes = [
    {
        path: 'login',
        component: LoginLayoutComponent,
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
            },
            {
                path: 'calendar',
                loadChildren: () => import('./features/calendar/calendar.module').then(m => m.CalendarModule)
            },
            {
                path: 'settings',
                loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule)
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    }
];
