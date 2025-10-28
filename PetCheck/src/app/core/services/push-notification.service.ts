import { inject, Injectable } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { doc, Firestore, setDoc} from "@angular/fire/firestore";
import { getToken, Messaging, onMessage, deleteToken } from "@angular/fire/messaging";

@Injectable({ providedIn: 'root'})
export class PushNotificationService {
    private messaging = inject(Messaging);
    private firestore = inject(Firestore);
    private auth = inject(Auth);

    private vapidKey = 'BPZ5Uf3I_ZNqJ6YvXNiBvju9rXJUTn5MFkDLwQCF0cPG2uJ6ZusWmV6tae0A8U8jRjpnmIJQevCsh7Ui6CQYe8Q';

    private onMessageUnsub?: () => void;

    async registerPushToken(): Promise<string | null> {
        const user = this.auth.currentUser;
        if(!user) return null;

        const permission = await Notification.requestPermission();
        if(permission !== 'granted') throw new Error('Permission not granted for Notification');

        try {
            const registration = await navigator.serviceWorker.ready;
            if(!registration) return null;
            console.log(registration);
            const token = await getToken(this.messaging, {
                vapidKey: this.vapidKey,
                serviceWorkerRegistration: registration,
            });

            console.log('token: ', token);

            if(!token) throw new Error('No registration token received');

            await setDoc(doc(this.firestore, `users/${user.uid}`), { pushToken: token }, { merge: true });
            console.log('Push token saved to user: ', token);

            return token;
        } catch (error: any) {
            console.error('Error while token generation: ', error);
            throw error;
        }
    }

    async removeTokenForCurrentUser(): Promise<void> {
        try {
            await deleteToken(this.messaging).catch(() => {});
            const user = this.auth.currentUser;
            if(!user) return;
            await setDoc(doc(this.firestore, `users/${user.uid}`), { pushToken: null }, { merge: true });
        } catch (error) {
            console.error('Error deleting token: ', error);
        }
    }

    listenForMessages() {
        if(this.onMessageUnsub) return;
        
        this.onMessageUnsub = onMessage(this.messaging, (payload) => {
            if(Notification.permission === 'granted') {
                try {
                    new Notification(payload.notification?.title ?? 'Erinnerung', {
                        body: payload.notification?.body,
                    });
                } catch (error) {
                    console.error('Error displaying notification: ', error);
                }
            }
        }) as unknown as () => void;
    }

    stopListening(): void {
        this.onMessageUnsub?.();
        this.onMessageUnsub = undefined;
    }

}