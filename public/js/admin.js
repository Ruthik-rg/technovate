import { db, auth } from './firebase.js';
import {
  collection, addDoc, onSnapshot, doc,
  getDocs, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { logoutUser } from './auth.js';

window.addClub = async function () {
  const name = document.getElementById('clubName').value;
  const desc = document.getElementById('clubDesc').value;
  const category = document.getElementById('clubCategory').value;
  const img = document.getElementById('clubImg').value;

  if (!name || !desc || !category || !img) return alert("Please fill all fields");

  await addDoc(collection(db, "clubs"), {
    name, desc, category, img,
    createdAt: new Date().toISOString()
  });

  alert("Club added!");
};

window.addPoster = async function () {
  const url = document.getElementById('posterUrl').value;
  if (!url) return alert("Poster URL is required");

  await addDoc(collection(db, "posters"), {
    url,
    createdAt: new Date().toISOString()
  });

  alert("Poster added!");
};

window.logoutUser = logoutUser;

// Load existing clubs
async function loadClubs() {
  const memberList = members.length > 0
  ? members.map(m => `
      <li>
        ${m.email}
        <button onclick="removeUserFromClub('${clubId}', '${m.id}')">Remove</button>
      </li>
    `).join('')
  : '<li>No members yet</li>';

const card = `
  <div class="club-card">
    <h4>${club.name}</h4>
    <p>${club.desc}</p>
    <strong>Members (${members.length}):</strong>
    <ul>${memberList}</ul>
  </div>
`;
clubTable.innerHTML += card;

  const clubTable = document.getElementById("clubTable");
  const announceSelect = document.getElementById("announceClub");
  clubTable.innerHTML = '';
  announceSelect.innerHTML = '';

  const clubsSnap = await getDocs(collection(db, "clubs"));
  clubsSnap.forEach(async (clubDoc) => {
    const club = clubDoc.data();
    const clubId = clubDoc.id;

    // Add to announcement dropdown
    const opt = document.createElement("option");
    opt.value = clubId;
    opt.innerText = club.name;
    announceSelect.appendChild(opt);

    // Count members
    const usersSnap = await getDocs(collection(db, "users"));
    const members = [];
    usersSnap.forEach(docSnap => {
      const data = docSnap.data();
      if (data.joinedClubs?.includes(clubId)) {
        members.push({ id: docSnap.id, email: data.email });
      }
    });

    const memberList = members.map(m => `<li>${m.email} <button onclick="removeUserFromClub('${clubId}', '${m.id}')">Remove</button></li>`).join('');

    const card = `
      <div class="club-card">
        <h4>${club.name}</h4>
        <p>${club.desc}</p>
        <strong>Members:</strong>
        <ul>${memberList || '<li>No members yet</li>'}</ul>
      </div>
    `;
    clubTable.innerHTML += card;
  });
}


async function loadFeedbacks() {
  const list = document.getElementById("feedbackList");
  list.innerHTML = "";

  const feedbackSnap = await getDocs(collection(db, "feedbacks"));

  feedbackSnap.forEach(doc => {
    const data = doc.data();
    list.innerHTML += `
    <div class="feedback-card">
      <strong>${data.name || "Anonymous"} (${data.userEmail || "?"})</strong>
      <em>${data.club || "General"}</em>
      <p>${data.message}</p>
      <small>${new Date(data.timestamp).toLocaleString()}</small>
    </div>
  `;
  
  });
}



window.removeUserFromClub = async function (clubId, userId) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    joinedClubs: arrayRemove(clubId)
  });
  alert("User removed from club");
  loadClubs(); // Refresh
};

window.postAnnouncement = async function () {
  const clubId = document.getElementById("announceClub").value;
  const message = document.getElementById("announcementText").value;
  const dateTime = document.getElementById("announcementDate").value;

  if (!clubId || !message || !dateTime) return alert("Fill all announcement fields");

  await addDoc(collection(db, `announcements/${clubId}/messages`), {
    message,
    timestamp: dateTime
  });

  alert("Announcement posted!");
};

loadClubs(); // Initial call
loadFeedbacks();
