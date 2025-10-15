import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup ,Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { PetActions } from '../../../../core/store/pets/pets.actions';
import { selectAuthUser } from '../../../../core/store/auth/auth.selectors';
import { Pet } from '../../../../core/model/pet';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';
import { HealthRecord } from '../../../../core/model/health-record';

@Component({
  selector: 'app-add-pet',
  imports: [ReactiveFormsModule],
  templateUrl: './add-pet.component.html',
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

    console.log(this.userId);

    const formValue = this.petForm.value;
    const newPet: Pet = {
      name: formValue.name,
    };

    this.store.dispatch(PetActions.addPet({ userId: this.userId, pet: newPet }));

    //this.router.navigate(['/dashboard']);
  }
}
