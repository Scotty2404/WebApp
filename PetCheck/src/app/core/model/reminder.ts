import { Timestamp } from "@angular/fire/firestore";

export interface Reminder {
    id?: string;
    petName: string;
    title: string;
    startTime: Timestamp;
    notified: boolean;
}

export type ReminderCreate = Omit<Reminder, 'id'>;