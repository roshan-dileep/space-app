// src/config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {getFireStore } from "firebase/firestore";
// Your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyDmtCLNcrfRZiGGsNqLoAPhCWgWdaiesn8",
  authDomain: "space-app-7d597.firebaseapp.com",
  projectId: "space-app-7d597",
  storageBucket: "space-app-7d597.appspot.com", 
  messagingSenderId: "238555156310",
  appId: "1:238555156310:web:7312b447e2345d2b2c50f7",
  measurementId: "G-M59JMW55H5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Pass the app instance to getAuth
const provider = new GoogleAuthProvider();
const db = getFireStore(app)

export { auth, provider };
