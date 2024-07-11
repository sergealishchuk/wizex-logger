import { getMessaging, getToken } from "firebase/messaging";
import firebaseApp from './firebaseApp';

const FIREBASE_PUBLIC_KEY = process.env.FIREBASE_PUBLIC_KEY;

let getNotificationToken;
if (typeof(navigator) !== 'undefined' && ('serviceWorker' in navigator)) {
  const messaging = getMessaging(firebaseApp);
  getNotificationToken = getToken(messaging, { vapidKey: FIREBASE_PUBLIC_KEY })
    .then((currentToken) => {
      if (currentToken) {
        return currentToken;
      } else {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            console.log('Notification permission granted.');
          } else {
            console.log('Notification permission not pgranted.');
          }
        })
      }
    })
    .catch((error) => {
      //console.log('Error occured when get Token')
    })
};

export default () => getNotificationToken;
