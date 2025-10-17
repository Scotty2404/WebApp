import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ReminderState } from "./reminders.reducer";

export const selectReminderState = createFeatureSelector<ReminderState>('reminders');

export const selectAllReminders = createSelector(
    selectReminderState,
    s => s.reminders
);

export const selectRemindersLoading = createSelector(
    selectReminderState,
    s => s.loading
);

export const selectReminderError = createSelector(
    selectReminderState,
    s => s.error
);
