import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup ,Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../../core/store/auth/auth.selectors';
import { filter, take } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarRoutingModule } from "../../../calendar/calendar-routing.module";
import { TitleComponent } from '../../components/title/title.component';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core'
import { Pet } from '../../../../core/model/pet';
import { Timestamp } from '@angular/fire/firestore';
import { PetActions } from '../../../../core/store/pets/pets.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { selectPetById } from '../../../../core/store/pets/pets.selectors';

@Component({
  selector: 'app-edit',
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
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
  petForm!: FormGroup;
  petId!: string;

  constructor(
    private fb: FormBuilder, 
    private store: Store, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.petId = this.route.snapshot.paramMap.get('id')!;

    this.store.select(selectPetById(this.petId)).pipe(
      filter((pet): pet is Pet => !!pet),
      take(1)
    ).subscribe(pet => {
      this.petForm = this.fb.group({
        name: [pet.name, Validators.required],
        species: [pet.species, Validators.required],
        breed: [pet.breed],
        birthDate: [pet.birthDate.toDate(), Validators.required],
      });
    });
  }

  onSubmit() {
    if(this.petForm.invalid) return;

    const newPet = this.petForm.value;

    const petToSave: Pet = {
      id: this.petId,
      name: newPet.name,
      species: newPet.species,
      breed: newPet.breed,
      birthDate: Timestamp.fromDate(newPet.birthDate),
    }

    this.store.dispatch(PetActions.updatePet({ pet: petToSave }));

    this.router.navigate(['/dashboard']);
  }
}
