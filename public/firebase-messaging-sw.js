importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');
importScripts('host-sw.js');

const firebaseConfig = {
  apiKey: "AIzaSyBCuYNWvuCoo4hgGKbfOpHIWz-mCY8ntC8",
  authDomain: "pushnotifications-5d1e8.firebaseapp.com",
  projectId: "pushnotifications-5d1e8",
  storageBucket: "pushnotifications-5d1e8.appspot.com",
  messagingSenderId: "97545990610",
  appId: "1:97545990610:web:ec2e0a9b4aca0b4759180b"
};

firebase.initializeApp(firebaseConfig);

let messaging;
if (firebase.messaging.isSupported()) {
  messaging = !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig).messaging()
    : firebase.app().messaging();
}

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const host = typeof(hostSW) !== 'undefined' && hostSW;
  fetch(`${host}/rest/users/readpush`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...payload,
      hostSW: typeof(hostSW) !== 'undefined' && hostSW,
    }),
  }).catch(error => {
    console.error(error)
  });

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body.text,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
