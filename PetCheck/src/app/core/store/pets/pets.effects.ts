import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {PetActions} from './pets.actions';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { of, from } from "rxjs";
import { Firestore, collection, collectionData } from "@angular/fire/firestore";
import { Pet } from "../../model/pet";
import { PetService } from "../../services/pet.service";

@Injectable()
export class PetEffects {
    private actions$ = inject(Actions);
    private firestore = inject(Firestore);
    private petService = inject(PetService);

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
            mergeMap(action => 
                from(this.petService.addPet(action.pet)).pipe(
                    map(() => PetActions.addPetSucess({pet: action.pet})),
                    catchError(error => of(PetActions.addPetFailure({ error })))
                )
            )
        )
    );

    updatePet$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PetActions.updatePet),
            mergeMap( action => 
                from(this.petService.updatePet(action.pet)).pipe(
                    map(() => PetActions.updatePetSucess({ pet: action.pet })),
                    catchError(error => of(PetActions.updatePetFailure({ error })))
                )
            )
        )
    );

    deletePet$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PetActions.deletePet),
            mergeMap(action =>
                from(this.petService.deletePet(action.petId)).pipe(
                    map(() => PetActions.deletePetSucess({ petId: action.petId})),
                    catchError(error => of(PetActions.deletePetFailure({ error })))
                )
            )
        )
    );
}
