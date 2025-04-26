// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyBJxu8_c-KANJei_O0Fl0bqAQOW821K_as",
  authDomain: "club-connect-da1e5.firebaseapp.com",
  projectId: "club-connect-da1e5",
  storageBucket: "club-connect-da1e5.firebasestorage.app",
  messagingSenderId: "563973308558",
  appId: "1:563973308558:web:f4364320517c808ddb49df",
  measurementId: "G-W7GRQT4501"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };