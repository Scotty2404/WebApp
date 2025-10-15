import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.reducer";

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthUser = createSelector(selectAuthState, (auth: AuthState) => auth.user);
export const selectIsAuthenticated = createSelector(selectAuthState, (auth: AuthState) => auth.isAuthenticated);
export const selectAuthLoading = createSelector(selectAuthState, (auth: AuthState) => auth.loading);
export const selectAuthError = createSelector(selectAuthState, (auth: AuthState) => auth.error);
