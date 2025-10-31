import { inject, Injectable } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { addDoc, collection, deleteDoc, doc, Firestore, updateDoc } from "@angular/fire/firestore";
import { Reminder } from "../model/reminder";


@Injectable({ providedIn: 'root' })
export class ReminderService {
    private firestore = inject(Firestore);
    private auth = inject(Auth);

    async addAppointment(appointment: Omit<Reminder, 'id' | 'notified'>) {
        const user = this.auth.currentUser;
        if(!user) throw new Error('Currently not lodded in');

        console.log('trying to add reminder...');

        console.log(user.uid);

        const ref = collection(this.firestore, `users/${user.uid}/reminders`);
        await addDoc(ref, { ...appointment, notified: false });
    }

    async updateReminder(appointment: Reminder) {
        const user = this.auth.currentUser;
        if(!user) throw new Error('Currently not logged in');

        const reminderDoc = doc(this.firestore, `users/${user.uid}/reminders/${appointment.id}`);
        await updateDoc(reminderDoc, { ...appointment });
    }

    async deleteReminder(appointmentId: string) {
        const user = this.auth.currentUser;
        if(!user) throw new Error('Currently not logged in');

        const petDoc = doc(this.firestore, `users/${user.uid}/reminders/${appointmentId}`);
        await deleteDoc(petDoc);
    }   
}