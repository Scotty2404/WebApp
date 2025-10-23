import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TitleComponent } from "../../../dashboard/components/title/title.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { PushNotificationService } from '../../../../core/services/push-notification.service';
import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';
import { selectAuthLoading, selectAuthUser, selectAuthUserPushToken } from '../../../../core/store/auth/auth.selectors';
import { User } from '../../../../core/model/user';
import { AsyncPipe }  from '@angular/common';
import { AuthActions } from '../../../../core/store/auth/auth.actions';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-overview',
  imports: [
    MatCardModule,
    TitleComponent,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    AsyncPipe
],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent {
  user$!: Observable<User | null>;
  loading$!: Observable<boolean>;
  token$!: Observable<string | null>;
  permission$!: Observable<string | null>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.loading$ = this.store.select(selectAuthLoading);
    this.user$ = this.store.select(selectAuthUser);
    this.token$ = this.store.select(selectAuthUserPushToken);
  }

  toggleNotifications(enabled: boolean) {
      if (enabled) {
        console.log('enabeling push-messages...');
        this.store.dispatch(AuthActions.generatePushToken());
      } else {
        console.log('disabeling push-messages...');
      }
  }
}
