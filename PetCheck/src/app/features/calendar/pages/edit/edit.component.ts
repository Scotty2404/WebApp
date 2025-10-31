import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { selectReminderById } from '../../../../core/store/reminders/reminder.selectors';
import { selectAllPets } from '../../../../core/store/pets/pets.selectors';
import { Reminder } from '../../../../core/model/reminder';
import { Pet } from '../../../../core/model/pet';
import { Timestamp } from '@angular/fire/firestore';
import { ReminderActions } from '../../../../core/store/reminders/reminders.actions';
import { TitleComponent } from '../../../dashboard/components/title/title.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AsyncPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-edit',
  imports: [
    TitleComponent,
    MatCardModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    AsyncPipe
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
  reminderForm!: FormGroup;
  pets$!: Observable<Pet[]>;
  reminderId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.reminderId = this.route.snapshot.paramMap.get('id')!;

    this.pets$ = this.store.select(selectAllPets);

    this.store.select(selectReminderById(this.reminderId)).pipe(
      filter((reminder): reminder is Reminder => !!reminder),
      take(1)
    ).subscribe(reminder => {
      this.reminderForm = this.fb.group({
        title: [reminder.title, Validators.required],
        petId: [reminder.petId, Validators.required],
        startDate: [reminder.startTime.toDate(), Validators.required],
        startTime: [reminder.startTime.toDate().toLocaleTimeString()],
        endTime: [reminder.endTime.toDate().toLocaleTimeString()],
      });
    });
  }

  onSubmit(): void {
    if (this.reminderForm.invalid) return;

    const formValue = this.reminderForm.value;

    const [hours, minutes] = formValue.startTime.split(':').map(Number);
    const start = new Date(formValue.startDate);
    start.setHours(hours, minutes, 0, 0);

    let end: Date;
    if (formValue.endTime) {
      const [endHours, endMinutes] = formValue.endTime.split(':').map(Number);
      end = new Date(formValue.startDate);
      end.setHours(endHours, endMinutes, 0, 0);
    } else {
      end = new Date(start);
    }

    // format data to be saved
    const reminderToSave = {
      petId: formValue.petId,
      title: formValue.title,
      startTime: Timestamp.fromDate(start),
      endTime: Timestamp.fromDate(end),
      notified: false
    };

    this.store.dispatch(ReminderActions.update({ appointment: reminderToSave }));
    this.router.navigate(['/calendar']);
  }

  toTimeString(timestamp: any): string {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toTimeString().slice(0, 5); // "HH:mm"
  }
}
