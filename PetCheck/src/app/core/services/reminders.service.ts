import { inject, Injectable } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { addDoc, collection, Firestore } from "@angular/fire/firestore";
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
}