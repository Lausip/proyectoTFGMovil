// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { deleteObject,getStorage,listAll,getMetadata,ref,put,getDownloadURL,uploadBytesResumable} from "firebase/storage";
import Constants from 'expo-constants';

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
let storage
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
  storage = getStorage();
} else {
  app = firebase.app();
  storage = getStorage();
}

const db = app.firestore();
const auth = firebase.auth();
const google= new firebase.auth.GoogleAuthProvider();

export { db, auth,google,firebase,storage,ref,put,getDownloadURL,uploadBytesResumable,deleteObject };