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
        const response = await messaging.send(message);
        console.log('Test Notification send: ', response);
    } catch (error) {
        console.error('Error while sending: ', error);
    }
}

async function checkAppointments() {
    const now = new Date();
    const in15min = new Date(now.getTime() + 15 * 60 * 1000);

    const usersSnapshot = await db.collection("users").get();

  try {
    const usersSnapshot = await db.collection("users").get();

    console.log(`Found ${usersSnapshot.docs.length} users`);

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const userToken = userData?.pushToken ?? null;

      if (!userToken) {
        console.warn(`No FCM token for user ${userDoc.id}, skipping`);
        continue;
      }

      console.log('Token for user: ', userData.id, 'is: ', userToken)

      const remindersRef = userDoc.ref.collection("reminders");

      const snapshot = await remindersRef
        .where("notified", "==", false)
        .get();

        const in15Reminders = snapshot.docs.filter(doc => {
        const data = doc.data();
        return data.startTime.toDate() <= in15min;
        });

      console.log(
        `User ${userDoc.id} has ${in15Reminders.length} reminders in next 15min`
      );

      for (const doc of in15Reminders) {
        const data = doc.data();

        if (!data.startTime) {
          console.warn(`Reminder ${doc.id} has no startTime, skipping`);
          continue;
        }

        const petDoc = await db.collection("users").doc(userDoc.id).collection("pets").doc(data.petId).get();
        const petData = petDoc.data();
        const petName = petData?.name ?? "Haustier";

        const startTime = data.startTime.toDate(); 
        const title = `Erinnerung für ${petName ?? "Haustier"}: ${data.title}`;
        const body = `um ${startTime.toLocaleTimeString()} Uhr`;

        const message = {
          token: userToken,
          notification: { title, body },
          data: {
            reminderId: doc.id,
            userId: userDoc.id,
          },
        };

        try {
          const response = await messaging.send(message);
          console.log(
            `Push sent to user ${userDoc.id} for reminder ${doc.id}: ${response}`
          );

          // Reminder als "benachrichtigt" markieren
          await doc.ref.update({ notified: true });
        } catch (error) {
          console.error(`Error sending push for reminder ${doc.id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error checking appointments:", error);
  }
}

cron.schedule("*/1 * * * *", () => checkAppointments());
console.log("Scheduler startet...");