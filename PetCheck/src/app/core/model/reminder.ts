export interface Reminder {
    id: number;
    petId: number;
    title: string;
    type: string;
    dueDate: Date;
    notes?: string;
    isCompleted: boolean;
}
