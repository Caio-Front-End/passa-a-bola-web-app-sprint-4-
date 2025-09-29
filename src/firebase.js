// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBl6dciua9yUCA3dBQpldOWdiMBQMuYqO4",
  authDomain: "passa-a-bola-app.firebaseapp.com",
  projectId: "passa-a-bola-app",
  storageBucket: "passa-a-bola-app.firebasestorage.app",
  messagingSenderId: "886090037431",
  appId: "1:886090037431:web:a000ffc834b52f81dcf532",
  measurementId: "G-ER967MQNZS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);