import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Pet } from '../../../../core/model/pet';

@Component({
  selector: 'app-pet-card',
  imports: [MatCardModule],
  templateUrl: './pat-card.component.html',
  styleUrl: './pat-card.component.css'
})
export class PatCardComponent {
  @Input() pet: any;
  @Output() select = new EventEmitter<void>();
}
