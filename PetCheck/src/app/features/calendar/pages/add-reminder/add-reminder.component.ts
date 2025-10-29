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
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { Pet } from '../../../../core/model/pet';
import { Observable } from 'rxjs';
import { selectReminderError } from '../../../../core/store/reminders/reminder.selectors';
import { Timestamp } from '@angular/fire/firestore';
import { selectAllPets } from '../../../../core/store/pets/pets.selectors';
import { AsyncPipe } from '@angular/common';

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
    MatSelectModule,
    AsyncPipe
],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-reminder.component.html',
  styleUrl: './add-reminder.component.css'
})
export class AddReminderComponent implements OnInit {
  reminderForm!: FormGroup;
  error$!: Observable<string | undefined>;
  pets$!: Observable<Pet[]>;

  constructor(private fb: FormBuilder, private store: Store, private router: Router) {}

  //initialize Form
  ngOnInit(): void {
      this.reminderForm = this.fb.group({
        title: ['', Validators.required],
        petId: ['', Validators.required],
        startDate: ['', Validators.required],
        startTime: ['', Validators.required],
        endTime: [''],
      });

      this.pets$ = this.store.select(selectAllPets);
      this.error$ = this.store.select(selectReminderError);
  }      

  onSubmit() {
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

    console.log('Saving reminder:', reminderToSave);


    //save data
    this.store.dispatch(ReminderActions.add({ appointment: reminderToSave }));
    this.router.navigate(['/calendar']);
  }
}
