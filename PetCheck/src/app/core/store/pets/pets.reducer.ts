import { createReducer, on } from "@ngrx/store";
import { PetActions } from './pets.actions';
import { Pet } from "../../model/pet";

export interface PetState {
    pets: Pet[];
    loading: boolean;
    error?: any;
    offlineQueue: any[];
}

export const initialState: PetState = {
    pets: [],
    loading: false,
    error: null,
    offlineQueue: []
};

export const petReducer = createReducer(
    initialState,

    //Load Pets
    on( PetActions.loadPets, state => ({ ...state, loading: true })),
    on( PetActions.loadPetsSuccess, ( state, { pets }) => ({
        ...state,
        loading: false,
        pets,
    })),
    on( PetActions.loadPetsFailure, ( state, { error } ) => ({ 
        ...state, 
        loading: false,
        error,
    })),

    //Add Pet
    on( PetActions.addPetSucess, ( state, { pet } ) => ({ 
        ...state, 
        pets: [...state.pets, pet],
    })),

    //Update Pet
    on( PetActions.updatePetSucess, ( state, { pet }) => ({ 
        ...state, 
        pets: state.pets.map(p => (p.id === pet.id ? pet : p)),
    })),

    //Delete Pet
    on( PetActions.deletePetSucess, ( state, { petId }) => ({ 
        ...state, 
        pets: state.pets.filter(p => p.id !== petId),
    })),

    //Manage Queue
    on( PetActions.queueOfflineAction, (state, {action}) => ({ 
        ...state, 
        offlineQueue: [...state.offlineQueue, action], 
    })),
    on( PetActions.syncOfflineActions, state => ({ 
        ...state, 
        offlineQueue: [],
    })),
)