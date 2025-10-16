import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup ,Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../../core/store/auth/auth.selectors';
import { take } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarRoutingModule } from "../../../calendar/calendar-routing.module";
import { TitleComponent } from '../../components/title/title.component';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core'
import { Pet } from '../../../../core/model/pet';
import { Timestamp } from '@angular/fire/firestore';
import { PetActions } from '../../../../core/store/pets/pets.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-pet',
  imports: [
    ReactiveFormsModule, 
    CalendarRoutingModule, 
    TitleComponent, 
    MatCard, 
    MatFormFieldModule, 
    MatLabel, 
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule
  ],
  templateUrl: './add-pet.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './add-pet.component.css'
})
export class AddPetComponent implements OnInit{
  petForm!: FormGroup;
  userId!: string;

  constructor(private fb: FormBuilder, private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.petForm = this.fb.group({
      name: ['', Validators.required],
      species: ['', Validators.required],
      breed: [''],
      birthDate: ['', Validators.required],
    });

    this.store.select(selectAuthUser).pipe(take(1)).subscribe(user => {
      if(user) this.userId = user.id;
    });
  }

  onSubmit() {
    if(this.petForm.invalid || !this.userId) return;

    const newPet = this.petForm.value;

    const petToSave: Pet = {
      name: newPet.name,
      species: newPet.species,
      breed: newPet.breed,
      birthDate: Timestamp.fromDate(newPet.birthDate),
    }

    console.log(this.userId);

    const formValue = this.petForm.value;
    this.store.dispatch(PetActions.addPet({ userId: this.userId, pet: newPet }));

    this.router.navigate(['/dashboard']);
  }
}
