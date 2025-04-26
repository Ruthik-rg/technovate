import { loginUser } from './auth.js';
import { db } from './firebase.js';
import {
  doc,
  getDoc
} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await loginUser(email, password);
    const uid = userCredential.user.uid;
    console.log("✅ Login successful, UID:", uid);

    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      console.log("📄 User Data:", data);

      const role = data.role;
      if (role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "index.html";
      }
    } else {
      alert("❌ User record not found in Firestore.");
    }
  } catch (err) {
    console.error("❌ Login error:", err.message);
    alert("Login Failed: " + err.message);
  }
});

