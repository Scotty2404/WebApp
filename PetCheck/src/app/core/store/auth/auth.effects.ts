import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Auth, signInWithEmailAndPassword, authState, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth'
import { Firestore, docData, setDoc, doc } from "@angular/fire/firestore";
import { AuthActions } from "./auth.actions";
import { mergeMap, switchMap, from, catchError, of, map, tap, take } from "rxjs";
import { User } from "../../model/user";
import { PushNotificationService } from "../../services/push-notification.service";
import { Router } from "@angular/router";

@Injectable()
export class AuthEffects {
    private actions$ = inject(Actions);
    private auth = inject(Auth);
    private firestore = inject(Firestore);
    private pushService = inject(PushNotificationService);
    private router = inject(Router);

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login),
            mergeMap(({ email, password }) =>
                from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
                    switchMap(({ user }) => {
                        const userDoc = doc(this.firestore, `users/${user.uid}`);
                        return docData(userDoc, { idField: 'id' }).pipe(
                            take(1),
                            map(fireUser =>  {
                                if (fireUser) return AuthActions.loginSucess({ user: fireUser as User});
                                else {
                                    const newUser:User = { id: user.uid, name: user.displayName ?? '', email: user.email ?? ''};
                                    setDoc(userDoc, newUser);
                                    return AuthActions.loginSucess({ user: newUser });
                                }
                        })
                        );
                    }),
                    catchError(error => {
                        console.error('[AuthEffect] Login Error:', error);
                        return of(AuthActions.loginFailure({ error }))
                    })
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

    //Generate Token
    generateToken$ = createEffect(() => 
        this.actions$.pipe(
            ofType(AuthActions.generatePushToken),
            switchMap(() => {
                return from(this.pushService.registerPushToken()).pipe(
                    map((token) => {
                        if (token == null) {
                            throw new Error('No token generated');
                        }
                        return AuthActions.generatePushTokenSuccess({ token: token as string });
                    }),
                    catchError((error) => of(AuthActions.generatePushTokenFailure({ error })))
                );
            })
        )
    );

    deleteToken$ = createEffect(() => 
        this.actions$.pipe(
            ofType(AuthActions.deletePushToken),
            switchMap(() => {
                return from
                (this.pushService.removeTokenForCurrentUser()).pipe(
                    map(() => {
                        return AuthActions.deletePushTokenSuccess();
                    }),
                    catchError((error) => of(AuthActions.deletePushTokenFailure({ error })))
                );
            })
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

    logoutSuccess$ = createEffect(() => 
        this.actions$.pipe(
            ofType(AuthActions.logoutSucess),
            tap(() => {
                this.router.navigate(['/login']);
            })
        ),
        { dispatch: false }
    );

    authState$ = createEffect(() =>
        authState(this.auth).pipe(
            switchMap(user => {
                if(!user) return of(AuthActions.authStateChanged({ user: null }));
                const userDoc = doc(this.firestore, `users/${user.uid}`);
                return docData(userDoc, { idField: 'id' }).pipe(
                    map(u => AuthActions.authStateChanged({ user: u as User})),
                    catchError(error => {
                        console.error('[AuthEffect] Error loading userDoc: ', error);
                        return of(AuthActions.authStateChanged({ user: null }));
                    })
                );
            })
        )
    );
}