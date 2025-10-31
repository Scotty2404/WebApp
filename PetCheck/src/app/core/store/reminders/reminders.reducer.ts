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

    //ADD
    on(ReminderActions.addSuccess, (state, { appointment }) => {
        const reminders = state.reminders ?? [];
        const exists = reminders.some(r => r.id === appointment.id);

        return exists
            ? { ...state, loading: false }
            : {
                ...state,
                loading: false,
                reminders: [...reminders, appointment],
            };
    }),
    on(ReminderActions.addFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    //UPDATE
    on(ReminderActions.updateSuccess, ( state, { appointment }) => ({
        ...state,
        reminders: state.reminders.map(r => (r.id === appointment.id ? appointment : r)),
    })),

    //DELETE
    on(ReminderActions.deleteSuccess, ( state, { appointmentId }) => ({ 
        ...state, 
        reminders: state.reminders.filter(p => p.id !== appointmentId),
    })),

    //LOAD
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
