import { auth } from './firebase.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

// Login
export function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Logout
export function logoutUser() {
  return signOut(auth).then(() => {
    window.location.href = "login.html";
  });
}

// Check login status
export function checkUser(callback) {
  onAuthStateChanged(auth, user => {
    callback(user);
  });
}