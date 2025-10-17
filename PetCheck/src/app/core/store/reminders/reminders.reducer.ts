import { createReducer, on } from "@ngrx/store";
import { ReminderActions } from "./reminders.actions";
import { Reminder } from "../../model/reminder";

export interface ReminderState {
    reminders: Reminder[];
    loading: boolean;
    error?: string;
}

export const initialState: ReminderState = {
    reminders: [],
    loading: false,
};

export const reminderReducer = createReducer(
    initialState,

    on(ReminderActions.addSuccess, (state, { appointment }) => ({
        ...state,
        loading: false,
        reminders: [...state.reminders, appointment],
    })),
    on(ReminderActions.addFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    on(ReminderActions.load, state => ({
        ...state,
        loading: true,
    })),
    on(ReminderActions.loadSuccess, (state, { appointments }) => ({
        ...state, 
        loading: false,
        reminders: [...state.reminders, ...appointments],
    })),
    on(ReminderActions.loadFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    }))
);
