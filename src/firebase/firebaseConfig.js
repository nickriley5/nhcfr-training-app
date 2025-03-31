import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB83RMcvw3-LsJBC_BNcEB4niY5e4dBEkY",
  authDomain: "nhcfr-training-app-8290a.firebaseapp.com",
  projectId: "nhcfr-training-app-8290a",
  storageBucket: "nhcfr-training-app-8290a.firebasestorage.app",
  messagingSenderId: "430522357777",
  appId: "1:430522357777:web:7ec1ef4c0e494c2a4439b0",
  measurementId: "G-WK7FHVMF1D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Add these lines:
export const auth = getAuth(app);
export const db = getFirestore(app);
