// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeKuPP1Q-6149e4OvCuPZ7-C8lLVUwnbs",
  authDomain: "timecapsuleapp-3f42a.firebaseapp.com",
  projectId: "timecapsuleapp-3f42a",
  storageBucket: "timecapsuleapp-3f42a.firebasestorage.app",
  messagingSenderId: "350369885547",
  appId: "1:350369885547:web:e6a04c2995b9b73160f02e",
  measurementId: "G-Y77MFJW84P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth, analytics };
