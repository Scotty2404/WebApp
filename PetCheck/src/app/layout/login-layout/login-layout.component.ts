import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../core/store/auth/auth.actions';
import { filter, Observable, take, tap } from 'rxjs';
import { selectAuthLoading, selectAuthUser, selectAuthError, selectIsAuthenticated } from '../../core/store/auth/auth.selectors';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-layout',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './login-layout.component.html',
  styleUrl: './login-layout.component.css'
})
export class LoginLayoutComponent implements OnInit {
  loginForm!: FormGroup;
  loading$!: Observable<boolean>;
  user$!: Observable<any>;
  error$?: Observable<any>;
  isOnline = navigator.onLine;
  registrate: Boolean = false;

  constructor(private fb: FormBuilder, private store: Store, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.loading$ = this.store.select(selectAuthLoading);
    this.user$ = this.store.select(selectAuthUser);
    this.error$ = this.store.select(selectAuthError);

    this.store.select(selectIsAuthenticated).pipe(
      filter(isAuth => isAuth === true),
      take(1),
    ).subscribe(() => {
      this.router.navigate(['/dashboard']);
    })

    window.addEventListener('online', () => (this.isOnline = true));
    window.addEventListener('offline', () => (this.isOnline = false));
  }

  onSubmit() {
    if (this.loginForm.invalid || !this.isOnline) return;
    if(this.registrate) {
      const { name, email, password } = this.loginForm.value;
      this.store.dispatch(AuthActions.register({ name: name!, email: email!, password: password!}));
    } else {
      const { email, password } = this.loginForm.value;
      this.store.dispatch(AuthActions.login({ email: email!, password: password! }));
    }
  }
}

