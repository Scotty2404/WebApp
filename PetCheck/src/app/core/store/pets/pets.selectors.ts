import { createFeatureSelector, createSelector } from "@ngrx/store";
import { PetState } from "./pets.reducer";

export const selectPetState = createFeatureSelector<PetState>('pets');

export const selectAllPets = createSelector(selectPetState, s => s.pets);
export const selectPetById = (id: string) =>
    createSelector(selectPetState, s => s.pets.find(p => p.id === id));
export const selectPetsLoading = createSelector(selectPetState, s => s.loading);