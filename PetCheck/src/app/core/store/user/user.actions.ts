import { createActionGroup, props } from "@ngrx/store";
import { User } from "../../model/user";

export const UserActions = createActionGroup({
    source: 'User',
    events: {
        //Load single User
        'Load User': props<{ userId: string }>(),
        'Load User Sucess': props<{ user: User }>(),
        'Load User Failure': props<{ error: any }>(),

        //Create User
        'Add User': props<{ user: User }>(),
        'Add User Sucess': props<{ user: User }>(),
        'Add User Failure': props<{ error: any }>(),

        //Update User
        'Update User': props<{ user: User }>(),
        'Update User Sucess': props<{ user: User }>(),
        'Update User Failure': props<{ error: any }>(),

        //Delete User
        'Delete User': props<{ userId: string }>(),
        'Delete User Sucess': props<{ userId: string }>(),
        'Delete User Failure': props<{ error: any }>(),
    }
})