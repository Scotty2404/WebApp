import { inject, Injectable } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { doc, Firestore, setDoc, updateDoc } from "@angular/fire/firestore";
import { getToken, Messaging, onMessage, deleteToken } from "@angular/fire/messaging";

@Injectable({ providedIn: 'root'})
export class PushNotificationService {
    private messaging = inject(Messaging);
    private firestore = inject(Firestore);
    private auth = inject(Auth);

    private onMessageUnsub?: () => void;

    async requestPermission(): Promise<string | null> {
        try {
            const permission = await Notification.requestPermission();
            const registration = await navigator.serviceWorker.ready;
            
            console.log('Permission status: ', permission);
            if(permission !== 'granted') return null;

            getToken(this.messaging, { 
                vapidKey: 'BJE0leHFrYHBWiGUvS131H1k_o23GW3e7z_WiVQ9Zoo4nP9SYu7XVb4cK0BWgGSLO_Mfz-l-bLxjIAtl7-y5N8c',
                serviceWorkerRegistration: registration
             }).then((currentToken) => {
            if (currentToken) {
                const user = this.auth.currentUser;
                if(!user) return null;

                setDoc(doc(this.firestore, `users/${user.uid}`), { pushToken: currentToken }, { merge: true });
                return currentToken;
            } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
                return null;
                // ...
            }
            }).catch((error) => {
                console.error('Push permission / token error:', error);
                return null;
            });
        } catch (error) {
            console.error('Push permission / token error:', error);
            return null;
        }

        return null;
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