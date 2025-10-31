import { Component } from '@angular/core';
import { TitleComponent } from '../../../dashboard/components/title/title.component';
import { MatDividerModule } from '@angular/material/divider';
import { Observable } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-details',
  imports: [
    TitleComponent,
    MatDividerModule
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  events$!: Observable<CalendarEvent[]>;

  constructor(private activatedRoute: ActivatedRoute, private store: Store) {}

  
}
