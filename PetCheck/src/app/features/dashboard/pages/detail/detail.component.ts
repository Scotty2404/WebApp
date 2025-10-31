import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleComponent } from "../../components/title/title.component";
import { MatDivider } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { selectPetById } from '../../../../core/store/pets/pets.selectors';
import { Pet } from '../../../../core/model/pet';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MatIcon } from "@angular/material/icon";
import { PetActions } from '../../../../core/store/pets/pets.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  imports: [TitleComponent, MatDivider, AsyncPipe, DatePipe, MatIcon],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {
  id!: string;
  pet$!: Observable<Pet | undefined>;
  constructor(private route: ActivatedRoute, private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    if(this.id) {
      this.pet$ = this.store.select(selectPetById(this.id));
    }
  }

  onDelete() {
    this.store.dispatch(PetActions.deletePet({ petId: this.id}));
    this.router.navigate(['/dashboard']);
  }
}
