import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Pet } from "../../model/pet";

export const PetActions = createActionGroup({
    source: 'Pet',
    events: {
        'Load Pets': props<{ userId: string }>(),
        'Load Pets Success': props<{ pets: Pet[] }>(),
        'Load Pets Failure': props<{ error: any }>(),

        'Add Pet': props<{ userId: string; pet: Pet }>(),
        'Add Pet Sucess': props<{ pet: Pet }>(),
        'Add Pet Failure': props<{ error: any }>(),

        'Update Pet': props<{ userId: string; pet: Pet }>(),
        'Update Pet Sucess': props<{ pet: Pet }>(),
        'Update Pet Failure': props<{ error: any }>(),

        'Delete Pet': props<{ userId: string; petId: string }>(),
        'Delete Pet Sucess': props<{ petId: string }>(),
        'Delete Pet Failure': props<{ error: number }>(),

        'Queue Offline Action': props<{ action: any}>(),
        'Sync Offline Actions': emptyProps(),
    }
})
