import { Component, OnInit } from '@angular/core';
import { CalendarMonthViewComponent, CalendarEvent, CalendarView, CalendarDayViewComponent } from 'angular-calendar';
import { TitleComponent } from '../../../dashboard/components/title/title.component';
import { combineLatest, map, Observable } from 'rxjs';
import  { Store } from '@ngrx/store';
import { selectAllPets } from '../../../../core/store/pets/pets.selectors';
import { AsyncPipe } from '@angular/common';
import { selectAllReminders } from '../../../../core/store/reminders/reminder.selectors';
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'app-overview',
  imports: [
    CalendarMonthViewComponent,
    TitleComponent,
    AsyncPipe,
    CalendarDayViewComponent,
    MatDivider
],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  events$!: Observable<CalendarEvent[]>;
  activeDayIsOpen: boolean = false;

  readonly CalendarView = CalendarView;
  viewDate = new Date();
  
  constructor(private store: Store) {}

  ngOnInit(): void {
    const pets$ = this.store.select(selectAllPets);
    const reminders$ = this.store.select(selectAllReminders);

    this.events$ = combineLatest([pets$, reminders$]).pipe(
      map(([pets, reminders]) => {
        const petEvents: CalendarEvent[] = pets.map(pet => ({
          start: pet.birthDate?.toDate(),
          title: `${pet.name}'s Geburtstag!`,
        }));

        const reminderEvents: CalendarEvent[] = reminders.map(reminder => {
          
          const pet = pets.find(p => p.id === reminder.petId);
          
          return {
            start: reminder.startTime?.toDate(),
            end: reminder.endTime?.toDate(),
            title: `${reminder.title} (${pet?.name})`,
          }
        });

        return [...petEvents, ...reminderEvents];
      })
    );
  }

  dayClicked(day: { date: Date }): void {
    this.viewDate = day.date;
    this.activeDayIsOpen = true;
  }
}
