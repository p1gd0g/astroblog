// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXsX-zmj1PxqSNRrMOHorxsJY836Pa8tc",
  authDomain: "p1gd0g-cc.firebaseapp.com",
  projectId: "p1gd0g-cc",
  storageBucket: "p1gd0g-cc.firebasestorage.app",
  messagingSenderId: "5050020796",
  appId: "1:5050020796:web:32cc4e8ea005af921371b9",
  measurementId: "G-BG7EHRY1WD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);