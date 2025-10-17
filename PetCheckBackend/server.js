import admin from "firebase-admin";
import cron from "node-cron";

admin.initializeApp({
    credential: admin.credential.cert("./serviceAccountKeay.json"),
});

const db = admin.firestore();
const messaging = admin.messaging();

async function checkAppointments() {
    const now = new Date();
    const in15min = new Date(now.getTime() + 15 * 60 * 1000);

    const snapshot = await db.collection("appointments")
        .where("time", "<=", in15min.toISOString())
        .where("notified", "==", false)
        .get();

    for (const doc of snapshot.docs) {
        const data = doc.data();

        if(data.usrToken) {
            await messaging.send({
                token: data.usrToken,
                notification: {
                    title: `Erinnerung für ${data.petName}: ${data.title}`,
                    body: `um ${new Date(data.time).toLocaleTimeString()}`,
                },
            });
            console.log(`Push send to ${data.usrId}`);

            await doc.ref.update({ notified: true });
        }
    }
}

cron.schedule("*/5 * * * *", checkAppointments);
console.log("Scheduler startet...");