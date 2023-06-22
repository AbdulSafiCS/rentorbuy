// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// web app Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMWj2HlwaZMODj96BL6ka9TfDPhMc9vJQ",
  authDomain: "house-marketplace-app-bfccf.firebaseapp.com",
  projectId: "house-marketplace-app-bfccf",
  storageBucket: "house-marketplace-app-bfccf.appspot.com",
  messagingSenderId: "198685186985",
  appId: "1:198685186985:web:e7903ee3c0c04ae8c942b8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
