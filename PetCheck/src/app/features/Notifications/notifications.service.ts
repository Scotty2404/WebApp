import { Injectable, signal, inject } from "@angular/core";
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private messaging = inject(Messaging);
    private firestore = inject(Firestore);
    token = signal<string | null>(null)
    message = signal<string | null>(null)

    async requestPermission(userId: string) {
        try {
            const token = await getToken(this.messaging, {
                vapidKey: 'YdHv6XGfX2RIiw-S1ZZSOq61arqlLczQfm9V4Qzx5dI',
            });
            if (token) {
                this.token.set(token);
                await setDoc(doc(this.firestore, 'users', userId), { token });
                console.log('push-token saved: ', token);
            }
        } catch (e) {
            console.error('Push-Notifications not allowed ', e);
        }
    }

    listen() {
        onMessage(this.messaging, (payload) => {
            this.message.set(payload.notification?.title ?? 'Neue Nachricht!');
        });
    }
}