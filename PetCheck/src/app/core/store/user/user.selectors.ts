import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "./user.reducer";

export const selectUserState = createFeatureSelector<UserState>('users');

export const selectSelectedUser = createSelector(selectUserState, s => s.selectedUser);
export const selectUserLoading = createSelector(selectUserState, s => s.loading);