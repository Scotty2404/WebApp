import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
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
