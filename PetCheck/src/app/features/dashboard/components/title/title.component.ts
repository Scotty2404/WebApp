import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-title',
  imports: [MatIcon, MatButtonModule, RouterLink],
  templateUrl: './title.component.html',
  styleUrl: './title.component.css'
})
export class TitleComponent {
@Input() pageTitle: string | null = '';
@Input() routerLink: string | null = '';
@Input() additionalButton: string | null = '';
@Input() iconSlot: string | null = '';
}
