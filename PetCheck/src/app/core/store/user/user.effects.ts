import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from "@angular/fire/firestore";
import { UserActions } from "./user.actions";
import { from, of } from 'rxjs';
import { catchError, map, mergeMap } from "rxjs/operators";
import { User } from "../../model/user";

@Injectable()
export class UserEffects {
    private actions$ = inject(Actions);
    private firestore = inject(Firestore);

    //Load User
    loadUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.loadUser),
            mergeMap(({ userId }) => {
                const userDoc = doc(this.firestore, `users/${userId}`);
                return docData(userDoc, { idField: 'id' }).pipe(
                    map(user => UserActions.loadUserSucess({ user: user as User})),
                    catchError(error => of(UserActions.loadUserFailure({ error })))
                );
            })
        )
    );

    //Add User
    AddUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.addUser),
            mergeMap(({ user }) => {
                const usersCol = collection(this.firestore, `users`);
                return from(addDoc(usersCol, user)).pipe(
                    map(docRef => UserActions.addUserSucess({ user: { ...user, id: docRef.id } })),
                    catchError(error => of(UserActions.addUserFailure({ error })))
                );
            })
        )
    );

    //Update User
    updateUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.updateUser),
            mergeMap(({ user }) => {
                const userDoc = doc(this.firestore, `users/${user.id}`);
                return from(updateDoc(userDoc, { ...user })).pipe(
                    map(() => UserActions.updateUserSucess({ user })),
                    catchError(error => of(UserActions.updateUserFailure({ error })))
                );
            })
        )
    );

    //Delete User
    deleteUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.deleteUser),
            mergeMap(({ userId }) => {
                const userDoc = doc(this.firestore, `users/${userId}`);
                return from(deleteDoc(userDoc)).pipe(
                    map(() => UserActions.deleteUserSucess({ userId })),
                    catchError(error => of(UserActions.deleteUserFailure({ error })))
                );
            })
        )
    );
}