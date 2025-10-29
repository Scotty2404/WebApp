import admin from "firebase-admin";
import cron from "node-cron";

admin.initializeApp({
    credential: admin.credential.cert("./serviceAccountKeay.json"),
});

const db = admin.firestore();
const messaging = admin.messaging();

const TEST_TOKEN = "c0tBAijqMCF6tXwdXQrRRC:APA91bE0zTePd46oBlvq6VNI6Gy6dmrRKa3cECiQ271lToOPl6tLsy_ZjLPlV2vLNHYtPvpKRLzPgU3CqL2rZc3Cxq221vM9x6Q9-K9EQIWwDfMZo2C7YZU";

async function sendTestNotification() {
    if(!TEST_TOKEN) {
        console.error('No test token provided');
        return;
    }

    const message = {
        token: TEST_TOKEN,
        notification: {
            title: 'Test Notification!',
            body: 'This message gets displayed every 5 Minutes',
        },
    };

    try {
        const response = messaging.send(message);
        console.log('Test Notification send: ', response);
    } catch (error) {
        console.error('Error while sending: ', error);
    }
}

async function checkAppointments() {
    const now = new Date();
    const in15min = new Date(now.getTime() + 15 * 60 * 1000);

    const usersSnapshot = await db.collection("users").get();

    for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const userToken = userData?.userToken ?? null;
        
        const remindersRef = userDoc.ref.collection('reminders');

        const in15Timestamp = admin.firestore.Timestamp.fromDate(in15min);
        
        const snapshot = await remindersRef
            .where("startTime", "<=", in15Timestamp)
            .where("notified", "==", false)
            .get();

        for(const doc of snapshot.docs) {
            const data = doc.data();
            const token = userToken ?? data.usrToken;
            if(!token) continue;
            
            const title = `Erinnerung für ${data.petName}: ${data.title}`;
            const body = `um ${new Date(data.startTime).toLocaleTimeString()} Uhr`;

            const message = {
                token,
                notification: { title, body },
                data: {
                    reminderId: doc.id,
                    userId: userDoc.id,
                },
            };

            try {
                await messaging.send(message);
                console.log(`Push sent to user: ${userDoc.id} for reminder: ${doc.id}`);
                await doc.ref.update({ notified: true });
            } catch (error) {
                console.error("Error sending push: ", error);
            }
        }
    }
}

cron.schedule("*/5 * * * *", sendTestNotification);
console.log("Scheduler startet...");