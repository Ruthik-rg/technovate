import { db, auth } from './firebase.js';
import {
  addDoc,
  collection
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

window.submitFeedback = async function () {
  const name = document.getElementById('name').value.trim();
  const club = document.getElementById('club').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!message) {
    alert("Feedback message is required.");
    return;
  }

  const user = auth.currentUser;

  try {
    await addDoc(collection(db, "feedbacks"), {
      name: name || "Anonymous",
      club: club || "General",
      message,
      userId: user ? user.uid : "Guest",
      userEmail: user ? user.email : "Unknown",
      timestamp: new Date().toISOString()
    });

    alert("Thank you for your feedback!");
    document.getElementById('name').value = "";
    document.getElementById('club').value = "";
    document.getElementById('message').value = "";
  } catch (error) {
    alert("Error submitting feedback: " + error.message);
  }
};

