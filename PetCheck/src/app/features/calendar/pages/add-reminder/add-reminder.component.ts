import { Component, OnInit } from '@angular/core';
import { TitleComponent } from '../../../dashboard/components/title/title.component';
import { MatCard } from '@angular/material/card';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ReminderActions } from '../../../../core/store/reminders/reminders.actions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ReminderState } from '../../../../core/store/reminders/reminders.reducer';
import { Reminder } from '../../../../core/model/reminder';
import { Observable } from 'rxjs';
import { selectReminderError } from '../../../../core/store/reminders/reminder.selectors';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-reminder',
  imports: [
    TitleComponent,
    MatCard,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-reminder.component.html',
  styleUrl: './add-reminder.component.css'
})
export class AddReminderComponent implements OnInit {
  reminderForm!: FormGroup;
  error$!: Observable<string | undefined>;

  constructor(private fb: FormBuilder, private store: Store, private router: Router) {}

  ngOnInit(): void {
      this.reminderForm = this.fb.group({
        title: ['', Validators.required],
        petName: ['', Validators.required],
        startTime: ['', Validators.required],
      });

      this.error$ = this.store.select(selectReminderError);
  }      

  onSubmit() {
    if(this.reminderForm.invalid) return;

    const newReminder = this.reminderForm.value;

    const reminderToSave = {
      title: newReminder.title,
      petName: newReminder.petName,
      startTime: Timestamp.fromDate(newReminder.startTime),
    }

    console.log('trying to add reminder: ', newReminder);
    this.store.dispatch(ReminderActions.add({ appointment: reminderToSave }));
    this.router.navigate(['/calendar']);
  }
}
