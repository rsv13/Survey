// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "survey-ef55b.firebaseapp.com",
  projectId: "survey-ef55b",
  storageBucket: "survey-ef55b.appspot.com",
  messagingSenderId: "642261413445",
  appId: "1:642261413445:web:8ee58f1efff6f35c7afd2c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
