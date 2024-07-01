// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAqJOvDkZYmmhS8GM8XchLSY40EvOp0S7w",
  authDomain: "flickz-509f9.firebaseapp.com",
  projectId: "flickz-509f9",
  storageBucket: "flickz-509f9.appspot.com",
  messagingSenderId: "238841559171",
  appId: "1:238841559171:web:6db9294ea7fda29e9f03b6",
  measurementId: "G-XE3K7VYR9W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)