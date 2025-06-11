// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBZtdHS1M-g2I77sYXOYVVu_FALhvdaUpA",
  authDomain: "summer-invitation.firebaseapp.com",
  projectId: "summer-invitation",
  storageBucket: "summer-invitation.appspot.com",  // ← 잘못된 부분 수정함 (.app → .app**spot.com**)
  messagingSenderId: "565120196161",
  appId: "1:565120196161:web:be1a680846f55efac630c0"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
