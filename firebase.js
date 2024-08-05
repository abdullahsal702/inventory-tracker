// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUn7sUrX6E03R0xQXiyY88hqNLac8STgw",
  authDomain: "pantry-f8287.firebaseapp.com",
  projectId: "pantry-f8287",
  storageBucket: "pantry-f8287.appspot.com",
  messagingSenderId: "340429232223",
  appId: "1:340429232223:web:5a9ef5d216a7416f5723ea",
  measurementId: "G-R0DYLWHJK6",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export const db = getFirestore(app);

let analytics;
let firestore;
if (firebaseConfig?.projectId) {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  if (app.name && typeof window !== "undefined") {
    analytics = getAnalytics(app);
  }

  // Access Firebase services using shorthand notation
  firestore = getFirestore(app);
}

export { analytics, firestore };
