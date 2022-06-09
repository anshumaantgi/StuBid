// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClGj91o1tsabXnJkwKzj-c3Ta1rXf0hqE",
  authDomain: "stubid-e3be1.firebaseapp.com",
  databaseURL: "https://stubid-e3be1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "stubid-e3be1",
  storageBucket: "stubid-e3be1.appspot.com",
  messagingSenderId: "759266240529",
  appId: "1:759266240529:web:ab845a8cbc07e5769669b0",
  measurementId: "G-HP0NLJYP4S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


//Mark : Authentication Reference
export const auth = getAuth(app);

//Mark: Firestore Reference
export const db = getFirestore();
