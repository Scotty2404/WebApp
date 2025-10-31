import { Component, OnInit } from '@angular/core';
import { TitleComponent } from '../../../dashboard/components/title/title.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { filter, Observable, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Reminder } from '../../../../core/model/reminder';
import { selectReminderById } from '../../../../core/store/reminders/reminder.selectors';
import { AsyncPipe } from '@angular/common';
import { selectPetById } from '../../../../core/store/pets/pets.selectors';
import { Pet } from '../../../../core/model/pet';
import { MatIcon } from "@angular/material/icon";
import { ReminderActions } from '../../../../core/store/reminders/reminders.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  imports: [
    TitleComponent,
    AsyncPipe,
    MatDividerModule,
    MatCardModule,
    MatButtonModule,
    MatIcon
],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit{
  reminder$!: Observable<Reminder | undefined>;
  assignedPet$!: Observable<Pet | undefined>;
  reminderId: string = '';

  constructor(private route: ActivatedRoute, private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.reminderId = this.route.snapshot.paramMap.get('id')!;
    
    this.reminder$ = this.store.select(selectReminderById(this.reminderId));
    this.assignedPet$ = this.reminder$.pipe(
      filter((reminder): reminder is Reminder => !!reminder && !!reminder.petId),
      switchMap(reminder =>
        this.store.select(selectPetById(reminder.petId))
      )
    )
  }

  onDelete() {
    this.store.dispatch(ReminderActions.delete({appointmentId: this.reminderId}));
    this.router.navigate(['/calendar']);
  }
}

