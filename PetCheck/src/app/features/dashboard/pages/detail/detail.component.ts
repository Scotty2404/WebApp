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

@Component({
  selector: 'app-detail',
  imports: [TitleComponent, MatDivider, AsyncPipe, DatePipe],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {
  pet$!: Observable<Pet | undefined>;
  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id) {
      this.pet$ = this.store.select(selectPetById(id));
    }
  }
}
