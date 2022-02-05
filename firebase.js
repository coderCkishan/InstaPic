// Import the functions you need from the SDKs you need
require("firebase/firestore");
require("firebase/storage");
import { initializeApp ,getApp,getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEHl6ECde-AH2JFdf-119b-fWeO474EI8",
  authDomain: "instapic-548a8.firebaseapp.com",
  projectId: "instapic-548a8",
  storageBucket: "instapic-548a8.appspot.com",
  messagingSenderId: "557481048636",
  appId: "1:557481048636:web:a92974bbab6ed13b1b2139"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage= getStorage();

export {app,db,storage};