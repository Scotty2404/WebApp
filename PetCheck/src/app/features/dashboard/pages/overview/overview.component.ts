import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { Router } from '@angular/router';
import { PatCardComponent } from '../../components/pat-card/pat-card.component';
import { Pet } from '../../../../core/model/pet';
import { Store } from '@ngrx/store';
import { selectAllPets } from '../../../../core/store/pets/pets.selectors';
import { Observable, take } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PetActions } from '../../../../core/store/pets/pets.actions';
import { selectAuthUser } from '../../../../core/store/auth/auth.selectors';
import { CalendarRoutingModule } from "../../../calendar/calendar-routing.module";
import { TitleComponent } from '../../components/title/title.component';
import { ReminderActions } from '../../../../core/store/reminders/reminders.actions';

@Component({
  selector: 'app-overview',
  imports: [
    MatButtonModule, 
    PatCardComponent, 
    AsyncPipe, 
    CalendarRoutingModule,
    TitleComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  pets$!: Observable<Pet[]>;
  userId!: string;
  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.store.select(selectAuthUser).pipe(take(1)).subscribe(user => {
      if(user) this.userId = user.id;
    });
    this.store.dispatch(PetActions.loadPets({userId: this.userId }));
    this.store.dispatch(ReminderActions.load({ userId: this.userId }));
    
    this.pets$ = this.store.select(selectAllPets);
  }
  openPet(pet: Pet) {
    this.router.navigate(['/dashboard/details', pet.id]);
  }

  addPet() {
    this.router.navigate(['/dashboard/add']);
  }
}
