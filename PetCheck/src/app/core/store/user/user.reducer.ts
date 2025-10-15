import { createReducer, on } from "@ngrx/store"; 
import { UserActions } from "./user.actions";
import { User } from "../../model/user";

export interface UserState {
    users: User[];
    selectedUser?: User;
    loading: boolean;
    loggedIn: boolean;
    error?: any;
}

export const initialState: UserState = {
    users: [],
    loading: false,
    loggedIn: false,
    error: null,
};

export const userReducer = createReducer(
    initialState,

    //LoadSingleUser
    on(UserActions.loadUser, state => ({ ...state, loading: true })),
    on(UserActions.loadUserSucess, (state, { user }) => ({
        ...state,
        selectedUser: user,
        loading: false,
        loggedIn: true,
    })),
    on(UserActions.loadUserFailure, (state, { error }) => ({
        ...state,
        loading: false,
        loggedIn: false,
        error,
    })),

    //Add
    on(UserActions.addUserSucess, (state, { user }) => ({
        ...state,
        users: [...state.users, user],
    })),

    //Update
    on(UserActions.updateUserSucess, (state, { user }) => ({
        ...state,
        users: state.users.map(u => (u.id === user.id ? user : u)),
        selectedUser: state.selectedUser?.id === user.id ? user: state.selectedUser,
    })),

    //Delete
    on(UserActions.deleteUserSucess, (state, { userId }) => ({
        ...state,
        users: state.users.filter(u => u.id !== userId),
        selectedUser: state.selectedUser?.id === userId ? undefined : state.selectedUser,
    }))
);
