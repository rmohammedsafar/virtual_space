import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZXm6VyOeDokUaAoHjX6UfnzsYKkYO1_s",
  authDomain: "virtualspace-128ef.firebaseapp.com",
  projectId: "virtualspace-128ef",
  storageBucket: "virtualspace-128ef.firebasestorage.app",
  messagingSenderId: "821263873854",
  appId: "1:821263873854:web:9267b4a12bfcbaeec69e6f",
  measurementId: "G-20H170PEG2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
