import { db, auth } from './firebase.js';
import {
  collection, onSnapshot, doc, updateDoc,
  arrayUnion, getDoc
} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';
import { logoutUser, checkUser } from './auth.js';

let currentUser;

// Check auth
checkUser(async user => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  currentUser = user;
  loadClubs();
  loadPosters();
  loadMyClubs();
});

// Load posters
function loadPosters() {
  const carousel = document.getElementById("carouselSection");
  onSnapshot(collection(db, "posters"), snapshot => {
    carousel.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      carousel.innerHTML += `<img src="\${data.url}" class="poster" alt="poster" />`;
    });
  });
}

// Load all clubs
function loadClubs() {
  const list = document.getElementById("clubList");
  onSnapshot(collection(db, "clubs"), snapshot => {
    list.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      list.innerHTML += `
        <div class="club-card">
          <h4>${data.name}</h4>
          <p>${data.desc}</p>
          <button class="join-btn" onclick="joinClub('${doc.id}')">Join</button>
        </div>
      `;
    });
  });
}

// Join a club
window.joinClub = async function (clubId) {
  const userRef = doc(db, "users", currentUser.uid);
  await updateDoc(userRef, {
    joinedClubs: arrayUnion(clubId)
  });
  alert("Joined successfully!");
  loadMyClubs();
}

// My Clubs section
function loadMyClubs() {
  const section = document.getElementById("joinedClubs");
  getDoc(doc(db, "users", currentUser.uid)).then(docSnap => {
    const joined = docSnap.data().joinedClubs || [];
    section.innerHTML = joined.length
      ? joined.map(id => `<div>${id}</div>`).join('')
      : "<p>No clubs joined yet.</p>";
  });
}

function loadMyClubs() {
  const section = document.getElementById("joinedClubs");

  getDoc(doc(db, "users", currentUser.uid)).then(docSnap => {
    const joined = docSnap.data().joinedClubs || [];

    section.innerHTML = joined.length
      ? joined.map(id => `<div>${id}</div>`).join('')
      : "<p>No clubs joined yet.</p>";

    loadAnnouncements(joined); // 👈 Load announcements for user's clubs
  });
}
function loadAnnouncements(clubIds) {
  const list = document.getElementById("announcementList");
  list.innerHTML = '';

  clubIds.forEach(async (clubId) => {
    const clubDoc = await getDoc(doc(db, "clubs", clubId));
    const clubData = clubDoc.exists() ? clubDoc.data() : { name: clubId, img: "" };
    const announcementsRef = collection(db, `announcements/${clubId}/messages`);
    const snapshot = await getDocs(announcementsRef);

    // Sort announcements by timestamp descending
    const sorted = snapshot.docs.sort((a, b) => {
      return new Date(b.data().timestamp) - new Date(a.data().timestamp);
    });

    sorted.forEach(doc => {
      const data = doc.data();
      list.innerHTML += `
        <div class="announcement-card">
          ${clubData.img ? `<img src="${clubData.img}" alt="${clubData.name}" class="club-icon" />` : ""}
          <div class="announcement-content">
            <strong>${clubData.name}</strong>
            <p>${data.message}</p>
            <small>${new Date(data.timestamp).toLocaleString()}</small>
          </div>
        </div>
      `;
    });
  });
}







// Tab switch
window.switchTab = function (tab) {
  document.getElementById("clubList").style.display = tab === "home" ? "block" : "none";
  document.getElementById("myClubs").style.display = tab === "myClubs" ? "block" : "none";
};

window.logoutUser = logoutUser;
