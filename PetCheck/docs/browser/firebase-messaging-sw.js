importScripts(
  "https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyBLb6gK4thvmfCdEvaOqaxNrlo-ruOZV9o",
    authDomain: "petcheck-c6543.firebaseapp.com",
    projectId: "petcheck-c6543",
    storageBucket: "petcheck-c6543.firebasestorage.app",
    messagingSenderId: "370355042235",
    appId: "1:370355042235:web:4e6ed52bd4b5ac8e39f69e"
}

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();