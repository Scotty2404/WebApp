import { Component, OnInit } from '@angular/core';
import { CalendarMonthViewComponent, CalendarEvent, CalendarView } from 'angular-calendar';
import { TitleComponent } from '../../../dashboard/components/title/title.component';
import { combineLatest, map, Observable } from 'rxjs';
import  { Store } from '@ngrx/store';
import { selectAllPets } from '../../../../core/store/pets/pets.selectors';
import { AsyncPipe } from '@angular/common';
import { selectAllReminders } from '../../../../core/store/reminders/reminder.selectors';
import { PushNotificationService } from '../../../../core/services/push-notification.service';

@Component({
  selector: 'app-overview',
  imports: [
    CalendarMonthViewComponent,
    TitleComponent,
    AsyncPipe,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  events$!: Observable<CalendarEvent[]>;
  readonly CalendarView = CalendarView;
  view: CalendarView = CalendarView.Month;
  viewDate = new Date();
  
  constructor(private store: Store, private pushNotificationServie: PushNotificationService) {}

  ngOnInit(): void {
    const pets$ = this.store.select(selectAllPets);
    const reminders$ = this.store.select(selectAllReminders);

    this.events$ = combineLatest([pets$, reminders$]).pipe(
      map(([pets, reminders]) => {
        const petEvents: CalendarEvent[] = pets.map(pet => ({
          start: pet.birthDate?.toDate(),
          title: `${pet.name}'s Geburtstag!`,
        }));

        const reminderEvents: CalendarEvent[] = reminders.map(reminder => ({
          start: reminder.startTime?.toDate(),
          title: `${reminder.title} (${reminder.petName})`,
        }));

        return [...petEvents, ...reminderEvents];
      })
    )      
  }
}
