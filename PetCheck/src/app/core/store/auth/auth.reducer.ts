import { createReducer, on } from "@ngrx/store";
import { AuthActions } from "./auth.actions";
import { User } from "../../model/user";

export interface AuthState {
    user: User | null;
    loading: boolean;
    error?: string;
    isAuthenticated: boolean;
}

export const initialState: AuthState = {
    user: null,
    loading: false,
    isAuthenticated: false,
};

export const authReducer = createReducer(
    initialState,

    on(AuthActions.login, AuthActions.register, state => {
        console.log('loggin in ... :', state);
        return {
            ...state,
            loading: true,
        };
    }),
    on(AuthActions.loginSucess, AuthActions.registerSucess, (state, { user }) => ({
        ...state,
        user,
        loading: false,
        isAuthenticated: true,
    })),

    on(AuthActions.loginFailure, AuthActions.registerFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error,
    })),

    on(AuthActions.logoutSucess, state => ({
        ...initialState,
    })),

    //Token
    on(AuthActions.generatePushToken, (state) => ({
        ...state,
        loading: true,
    })),
    on(AuthActions.generatePushTokenSuccess, (state, { token }) => ({
        ...state,
        loading: false,
        user: state.user ? { ...state.user, pushToken: token } : null,
    })),
    on(AuthActions.generatePushTokenFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error,
    })),

    on(AuthActions.deletePushToken, (state) => ({
        ...state,
        loading: true,
    })),

    on(AuthActions.deletePushTokenSuccess, (state) => ({
        ...state,
        loading: false,
        user: state.user ? { ...state.user, pushToken: null } : null,
    })),

    on(AuthActions.deletePushTokenFailure, (state) => ({
        ...state,
        loading: false,
    })),

    on(AuthActions.authStateChanged, (state, { user }) => ({
        ...state,
        user,
        isAuthenticated: !!user,
    }))
);
