import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../component/navbar/navbar.component";
import { HeaderComponent } from "../component/header/header.component";
import { filter, map, startWith } from "rxjs/operators";
import { TitleComponent } from "../../features/dashboard/components/title/title.component";
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { PushNotificationService } from '../../core/services/push-notification.service';

@Component({
  selector: 'app-main-layout',
  imports: [NavbarComponent, HeaderComponent, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit{
  
  constructor(private pushService: PushNotificationService) {}

  ngOnInit(): void {
    this.pushService.listenForMessages();
  }
}
