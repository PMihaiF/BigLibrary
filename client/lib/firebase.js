// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAZRhaDhvruI8wRyDbCrlD8-SUEqI4xGlk",
    authDomain: "seproject-916c2.firebaseapp.com",
    projectId: "seproject-916c2",
    storageBucket: "seproject-916c2.firebasestorage.app",
    messagingSenderId: "28180492566",
    appId: "1:28180492566:web:f5fcebb5274b0dc7a5e037",
    measurementId: "G-Q32CTRXPQ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
