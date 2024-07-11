import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBCuYNWvuCoo4hgGKbfOpHIWz-mCY8ntC8",
  authDomain: "pushnotifications-5d1e8.firebaseapp.com",
  projectId: "pushnotifications-5d1e8",
  storageBucket: "pushnotifications-5d1e8.appspot.com",
  messagingSenderId: "97545990610",
  appId: "1:97545990610:web:ec2e0a9b4aca0b4759180b"
};

let firebaseApp;
if (typeof (window) !== 'undefined') {
  firebaseApp = initializeApp(firebaseConfig);
}

export default firebaseApp;
