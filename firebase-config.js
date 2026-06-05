// ============================================================
// KULLU HAGAH STORE - Firebase Configuration
// ============================================================

// IMPORTANT: Replace the firebaseConfig object below with your actual
// configuration from the Firebase Console (Project Settings > General)
const firebaseConfig = {
  apiKey: "AIzaSyD1fDT0HLYOuxOY2oafOwWm95bnRQjv5sY",
  authDomain: "kullu-hagah-store.firebaseapp.com",
  projectId: "kullu-hagah-store",
  storageBucket: "kullu-hagah-store.firebasestorage.app",
  messagingSenderId: "836589641441",
  appId: "1:836589641441:web:0ef670d54cff3cd85ba1a0",
  measurementId: "G-PBQ7YBGBRN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Firestore database instance
const db = firebase.firestore();
window.db = db; // Make db globally available for other scripts

