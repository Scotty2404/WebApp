import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Pet } from '../../../../core/model/pet';

@Component({
  selector: 'app-pet-card',
  imports: [MatCardModule, MatIcon],
  templateUrl: './pat-card.component.html',
  styleUrl: './pat-card.component.css'
})
export class PatCardComponent {
  @Input()
  pet!: Pet;
  @Output() select = new EventEmitter<string>();
}
