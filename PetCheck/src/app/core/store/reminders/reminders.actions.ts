import { createActionGroup, props } from "@ngrx/store";
import { Reminder } from "../../model/reminder";

export const ReminderActions = createActionGroup({
    source: 'Reminder',
    events: {
        //ADD Notification
        'Add': props<{ appointment: Omit<Reminder, 'id' | 'notified'> }>(),
        'Add Success': props<{ appointment:Reminder }>(),
        'Add Failure': props<{ error: string }>(),

        //Update
        'Update': props<{ appointment: Reminder}>(),
        'Update Success': props<{ appointment:Reminder }>(),
        'Update Failure': props<{ error: string }>(), 

        //Delete
        'Delete': props<{ appointmentId: string}>(),
        'Delete Success': props<{ appointmentId:string }>(),
        'Delete Failure': props<{ error: string }>(), 

        //Load Reminders
        'Load': props<{userId: string}>(),
        'LoadSuccess': props<{ appointments: Reminder[] }>(),
        'LoadFailure': props<{ error: string }>()
    }
})