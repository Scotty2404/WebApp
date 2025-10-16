import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './pages/overview/overview.component';
import { DetailComponent } from './pages/detail/detail.component';
import { AddPetComponent } from './pages/add-pet/add-pet.component';

const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { 
    path: 'overview', 
    component: OverviewComponent,
    data: { title: 'PetCheck', subtitle: 'Meine Haustiere', returnLink: '' }
  },
  { 
    path: 'details/:id', 
    component: DetailComponent,
    data: { title: 'PetCheck', subtitle: 'Details', returnLink: '/overview' } 
  },
  { 
    path: 'add', 
    component: AddPetComponent,
    data: { title: 'PetCheck', subtitle: 'Hinzufügen', returnLink: '/overview'  } 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
