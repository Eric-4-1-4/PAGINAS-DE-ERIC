// FireBase/Firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js"; // ✅ IMPORTAR

const firebaseConfig = {
  apiKey: "AIzaSyDlBSsBV-cF4Th_VGSMGuE2-Xjtx8DBlTk",
  authDomain: "villaromana-ab294.firebaseapp.com",
  projectId: "villaromana-ab294",
  storageBucket: "villaromana-ab294.appspot.com",
  messagingSenderId: "286932050974",
  appId: "1:286932050974:web:162e3823a5e2374f853a0f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ INICIALIZA FIRESTORE

export { auth, db }; // ✅ EXPORTA TAMBIÉN `db`
