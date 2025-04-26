import { db, auth, storage } from './firebase.js';
import {
  collection, addDoc, deleteDoc, doc, getDocs
} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';
import {
  ref, uploadBytes, getDownloadURL
} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js';

const input = document.getElementById('mediaInput');
const gallery = document.getElementById('galleryItems');
let selectedToDelete = [];

window.uploadSelected = async function () {
  const files = input.files;
  const caption = document.getElementById("caption").value;
  const club = document.getElementById("clubTag").value;

  for (let file of files) {
    const fileRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);

    await addDoc(collection(db, "gallery"), {
      url,
      caption,
      club: club || "General",
      uploadedBy: auth.currentUser?.email || "admin",
      uploaderId: auth.currentUser?.uid || "admin",
      type: file.type.startsWith("video") ? "video" : "image",
      timestamp: new Date().toISOString()
    });
  }

  alert("All files uploaded!");
  loadGallery();
};

window.loadGallery = async function () {
  gallery.innerHTML = "";
  selectedToDelete = [];

  const snaps = await getDocs(collection(db, "gallery"));
  snaps.forEach(docSnap => {
    const d = docSnap.data();
    const id = docSnap.id;

    gallery.innerHTML += `
      <div class="gallery-card">
        <input type="checkbox" onchange="toggleDelete('${id}', this.checked)" />
        <strong>${d.uploadedBy}</strong> • <em>${d.club}</em>
        <p>${d.caption}</p>
        ${d.type === "video"
          ? `<video controls width="100%"><source src="${d.url}" /></video>`
          : `<img src="${d.url}" width="100%" style="border-radius:12px;" />`}
      </div>
    `;
  });
};

window.toggleDelete = function (id, isChecked) {
  if (isChecked) {
    selectedToDelete.push(id);
  } else {
    selectedToDelete = selectedToDelete.filter(i => i !== id);
  }
};

window.deleteSelected = async function () {
  for (let id of selectedToDelete) {
    await deleteDoc(doc(db, "gallery", id));
  }
  alert("Selected items deleted.");
  loadGallery();
};

window.onload = loadGallery;
