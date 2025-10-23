import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TitleComponent } from "../../../dashboard/components/title/title.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { PushNotificationService } from '../../../../core/services/push-notification.service';
import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';
import { selectAuthUser } from '../../../../core/store/auth/auth.selectors';
import { User } from '../../../../core/model/user';
import { AsyncPipe }  from '@angular/common';
import { UserActions } from '../../../../core/store/user/user.actions';
import { Auth } from '@angular/fire/auth';
import { AuthActions } from '../../../../core/store/auth/auth.actions';

@Component({
  selector: 'app-overview',
  imports: [
    MatCardModule,
    TitleComponent,
    MatSlideToggleModule,
    AsyncPipe
],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent {
  user$!: Observable<User | null>;
  notificationsEnabled$!: Observable<boolean>;
  token$!: Observable<string | null>;
  permission$!: Observable<string | null>;
  userId: string | null = null;

  constructor(private pushService: PushNotificationService, private store: Store, private auth: Auth) {}

  ngOnInit() {
    this.user$ = this.store.select(selectAuthUser);
    this.token$ = this.user$.pipe(
      map(user => user?.pushToken || null)
    );

    this.notificationsEnabled$ = this.user$.pipe(
      map(user => !!user?.pushToken)
    );

    this.userId = this.auth.currentUser ? this.auth.currentUser.uid : null;
  }

  toggleNotifications(enabled: boolean) {
    if(!this.userId) return;
      if (enabled) {
        console.log('enabeling push-messages...');
        this.pushService.requestPermission().then(token => {
          if(token != null) {
            console.log('token received: ', token);
            this.store.dispatch(AuthActions.reloadUser({ userId: this.userId! }));
            this.pushService.listenForMessages();
          }
        });
      } else {
        this.pushService.removeTokenForCurrentUser().then(() => {
          this.store.dispatch(AuthActions.reloadUser({ userId: this.userId! }));
        });
      }
  }
}
