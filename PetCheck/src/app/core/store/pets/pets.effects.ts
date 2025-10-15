import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {PetActions} from './pets.actions';
import { map, switchMap, catchError, tap, mergeMap } from 'rxjs/operators';
import { of, from } from "rxjs";
import { Firestore, collection, addDoc, doc, updateDoc, collectionData } from "@angular/fire/firestore";
import { collection as col, deleteDoc } from '@firebase/firestore';
import { Pet } from "../../model/pet";

@Injectable()
export class PetEffects {
    private actions$ = inject(Actions);
    private firestore = inject(Firestore);

    loadPets$ = createEffect(() => 
        this.actions$.pipe(
            ofType(PetActions.loadPets),
            mergeMap(({ userId }) => {
                const petCollection = collection(this.firestore, `users/${userId}/pets`);
                return collectionData(petCollection, { idField: 'id' }).pipe(
                    map(pets => PetActions.loadPetsSuccess({ pets: pets as Pet[] })),
                    catchError(error => of(PetActions.loadPetsFailure({ error })))
                );
            })
        )
    );

    addPet$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PetActions.addPet),
            mergeMap(({ userId, pet }) => {
                const petCollection = collection(this.firestore, `users/${userId}/pets`);
                console.log('Payload: ', pet, userId);
                return from(addDoc(petCollection, { ...pet, ownerId: userId })).pipe(
                    map(docRef => 
                        PetActions.addPetSucess({ pet: { ...pet, id: docRef.id, ownerId: userId } })
                    ),
                    catchError(error => of(PetActions.addPetFailure({ error })))
                );
            })
        )
    );

    updatePet$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PetActions.updatePet),
            mergeMap(({ userId, pet }) => {
                const petDoc = doc(this.firestore, `users/${userId}/pets/${pet.id}`);
                return from(updateDoc(petDoc, { ...pet })).pipe(
                    map(() => PetActions.updatePetSucess({ pet })),
                    catchError(error => of(PetActions.updatePetFailure({ error })))
                );
            })
        )
    );

    deletePet$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PetActions.deletePet),
            mergeMap(({ userId, petId }) => {
                const petDoc = doc(this.firestore, `users/${userId}/pets/${petId}`);
                return from(deleteDoc(petDoc)).pipe(
                    map(() => PetActions.deletePetSucess({ petId })),
                    catchError(error => of(PetActions.deletePetFailure({ error })))
                );
            })
        )
    );
}
