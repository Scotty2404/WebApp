export interface Reminder {
    id?: string;
    petName: string;
    title: string;
    time: string;
    notified: boolean;
    notes?: string;
}

export type ReminderCreate = Omit<Reminder, 'id'>;