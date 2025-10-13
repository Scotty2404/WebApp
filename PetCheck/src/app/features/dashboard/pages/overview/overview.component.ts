import { Component } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { PatCardComponent } from '../../components/pat-card/pat-card.component';
import { Pet } from '../../../../core/model/pet';

@Component({
  selector: 'app-overview',
  imports: [MatButtonModule, PatCardComponent, MatIcon],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent {
  pets: Pet[] = [];
  constructor(private router: Router) {}

  openPet(pet: Pet) {
    this.router.navigate(['/dashboard/details', pet.id]);
  }

  addPet() {
    this.router.navigate(['/dashboard/add']);
  }
}
