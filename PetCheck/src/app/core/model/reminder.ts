import { Timestamp } from "@angular/fire/firestore";

export interface Reminder {
    id?: string;
    petId: string;
    title: string;
    startTime: Timestamp;
    endTime: Timestamp;
    notified: boolean;
}

export type ReminderCreate = Omit<Reminder, 'id'>;