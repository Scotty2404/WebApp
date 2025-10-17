import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ReminderActions } from "./reminders.actions";
import { mergeMap, from, catchError, of, map } from "rxjs";
import { ReminderService } from "../services/reminders.service";
import { collection, collectionData, Firestore } from "@angular/fire/firestore";
import { Reminder } from "../../model/reminder";

@Injectable()
export class reminderEffects {
    private actions$ = inject(Actions);
    private firestore = inject(Firestore);
    private ReminderService = inject(ReminderService);

    add$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ReminderActions.add),
            mergeMap(action => 
                from(this.ReminderService.addAppointment(action.appointment)).pipe(
                    map(() => ReminderActions.addSuccess({
                        appointment: { ...action.appointment, notified: false }
                    })),
                    catchError(error => of(ReminderActions.addFailure({ error })))
                )
            )
        )
    );

    load$ = createEffect(() =>
    this.actions$.pipe(
        ofType(ReminderActions.load),
        mergeMap(({ userId }) => {
            const reminderCol = collection(this.firestore, `users/${userId}/reminders`);
            return collectionData(reminderCol, { idField: 'id' }).pipe(
                map((reminders) => ReminderActions.loadSuccess({ appointments: reminders as Reminder[] })),
                catchError(error => of(ReminderActions.loadFailure({ error })))
            )
        })
    ));
}