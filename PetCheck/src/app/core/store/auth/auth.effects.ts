import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Auth, signInWithEmailAndPassword, authState, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth'
import { Firestore, docData, setDoc, doc } from "@angular/fire/firestore";
import { AuthActions } from "./auth.actions";
import { mergeMap, switchMap, from, catchError, of, map, tap } from "rxjs";
import { User } from "../../model/user";

@Injectable()
export class AuthEffects {
    private actions$ = inject(Actions);
    private auth = inject(Auth);
    private firestore = inject(Firestore);

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login),
            mergeMap(({ email, password }) =>
                from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
                    switchMap(({ user }) => {
                        const userDoc = doc(this.firestore, `users/${user.uid}`);
                        return docData(userDoc, { idField: 'id' }).pipe(
                            map(fireUser => AuthActions.loginSucess({ user: fireUser as User})),
                            catchError(() => {
                                const newUser: User = { id: user.uid, name: user.email ?? '', email: user.email ?? ''};
                                setDoc(userDoc, newUser);
                                return of(AuthActions.loginSucess({ user: newUser }));
                            })
                        );
                    }),
                    catchError(error => of(AuthActions.loginFailure({ error })))
                )
            )
        )
    );

    //Register
    register$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.register),
            mergeMap(({ email, password, name }) => 
                from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
                    switchMap(({ user }) => {
                        const newUser: User = { id: user.uid, name, email };
                        const userDoc = doc(this.firestore, `users/${user.uid}`);
                        return from(setDoc(userDoc, newUser)).pipe(
                            map(() => AuthActions.registerSucess({ user: newUser })),
                            catchError(error => of(AuthActions.registerFailure({ error })))
                        );
                    }),
                    catchError(error => of(AuthActions.registerFailure({ error })))
                )
            )
        )
    );

    //Logout
    logout$ = createEffect(() => 
        this.actions$.pipe(
            ofType(AuthActions.logout),
            mergeMap(() =>
                from(signOut(this.auth)).pipe(
                    map(() => AuthActions.logoutSucess()),
                    catchError(error => of(AuthActions.logoutFailure({ error })))
                )
            )
        )
    );

    authState$ = createEffect(() =>
        authState(this.auth).pipe(
            switchMap(user => {
                if(!user) return of(AuthActions.authStateChanged({ user: null }));
                const userDoc = doc(this.firestore, `users/${user.uid}`);
                return docData(userDoc, { idField: 'id' }).pipe(
                    map(u => AuthActions.authStateChanged({ user: u as User}))
                );
            })
        )
    );
}