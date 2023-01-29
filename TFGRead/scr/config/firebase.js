// Import the functions you need from the SDKs you need
import { initializeApp ,getApps} from 'firebase/app';
import { getAuth ,initializeAuth,getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";

import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxK6_fLLlB0yheXvlQkl9aEmhs-YxrAKk",
  authDomain: "tfgbook-f69af.firebaseapp.com",
  projectId: "tfgbook-f69af",
  storageBucket: "tfgbook-f69af.appspot.com",
  messagingSenderId: "108512310726",
  appId:"1:108512310726:web:cb7608b0ed91f7a3bdeec7",
  measurementId: "G-Z59L7NRWRN"
};
let app;
let auth;
if (getApps().length < 1) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = getApp();
  auth = getAuth();
}
/* const app = initializeApp(firebaseConfig);
const auth = getAuth(app); */
const storage = getStorage(app);
