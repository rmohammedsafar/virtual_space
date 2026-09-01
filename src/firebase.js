import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDjc_Ys8OHzoLPJhq-z4JMSCHopywFs9rw",
  authDomain: "virtualspace-67525.firebaseapp.com",
  projectId: "virtualspace-67525",
  storageBucket: "virtualspace-67525.firebasestorage.app",
  messagingSenderId: "137749016636",
  appId: "1:137749016636:web:d09da639e9f34d37a89339",
  measurementId: "G-7LZNFPBK98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
