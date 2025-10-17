import { Component, OnInit } from '@angular/core';
import { CalendarMonthViewComponent, CalendarEvent, CalendarView } from 'angular-calendar';
import { TitleComponent } from '../../../dashboard/components/title/title.component';
import { map, Observable } from 'rxjs';
import  { Store } from '@ngrx/store';
import { selectAllPets } from '../../../../core/store/pets/pets.selectors';
import { AsyncPipe } from '@angular/common';

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
  
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.events$ = this.store.select(selectAllPets).pipe(
      map(pets => {
        if(!pets){
          return [];
        }
        return pets.map(pet => ({
          start: pet.birthDate?.toDate(),
          title: `${pet.name}'s Geburtstag!`,
        })) as CalendarEvent[]
      })
    );      
  }
}
