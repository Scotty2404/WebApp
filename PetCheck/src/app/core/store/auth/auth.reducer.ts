import { createReducer, on } from "@ngrx/store";
import { AuthActions } from "./auth.actions";
import { User } from "../../model/user";

export interface AuthState {
    user: User | null;
    loading: boolean;
    error?: any;
    isAuthenticated: boolean;
}

export const initialState: AuthState = {
    user: null,
    loading: false,
    error: null, 
    isAuthenticated: false,
};

export const authReducer = createReducer(
    initialState,

    on(AuthActions.login, AuthActions.register, state => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(AuthActions.loginSucess, AuthActions.registerSucess, (state, { user }) => ({
        ...state,
        user,
        loading: false,
        isAuthenticated: true,
    })),

    on(AuthActions.loginFailure, AuthActions.registerFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    on(AuthActions.logoutSucess, state => ({
        ...initialState,
    })),

    on(AuthActions.authStateChanged, (state, { user }) => ({
        ...state,
        user,
        isAuthenticated: !!user,
    }))
);
