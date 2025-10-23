importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBLb6gK4thvmfCdEvaOqaxNrlo-ruOZV9o",
    projectId: "petcheck-c6543",
    messagingSenderId: "370355042235",
    appId: "1:370355042235:web:4e6ed52bd4b5ac8e39f69e"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationBody = payload.notification.body;

    self.registration.showNotification(notificationTitle, notificationBody);
});