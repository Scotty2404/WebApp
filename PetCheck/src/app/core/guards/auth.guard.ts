import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Store } from '@ngrx/store';
import { selectAuthUser, selectIsAuthenticated } from "../store/auth/auth.selectors";
import { filter, map, take, tap } from 'rxjs/operators';
import { Observable } from "rxjs";
import { User } from "../model/user";

export const AuthGuard: CanActivateFn = (): Observable<boolean> => {
    const store = inject(Store);
    const router = inject(Router);

    return store.select(selectIsAuthenticated).pipe(
        take(1),
        tap(isLoggedIn => {
            if(!isLoggedIn) {
                router.navigate(['/login']);
            }
        })
    );
};