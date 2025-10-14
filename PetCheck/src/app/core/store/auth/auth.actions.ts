import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { User } from "../../model/user";

export const AuthActions = createActionGroup({
    source: 'auth',
    events: {
        //Login
        'Login': props<{ email: string; password: string }>(),
        'Login Sucess': props<{ user: User }>(),
        'Login Failure': props<{ error: any }>(),

        //Logout
        'Logout': emptyProps(),
        'Logout Sucess': emptyProps(),
        'Logout Failure': props<{ error: any }>(),

        'Auth State Changed': props<{ user: User | null }>(),

        //Register
        'Register': props<{ email: string; password: string, name: string }>(),
        'Register Sucess': props<{ user: User }>(),
        'Register Failure': props<{ error: any }>(),
    }
})