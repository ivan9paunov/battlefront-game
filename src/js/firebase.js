// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAD89rXr7TU3P5ffSWMm7JbWtJxMSkLFDw',
  authDomain: 'shooting-game-exercise.firebaseapp.com',
  projectId: 'shooting-game-exercise',
  storageBucket: 'shooting-game-exercise.firebasestorage.app',
  messagingSenderId: '206947518032',
  appId: '1:206947518032:web:69b762edf4483b22e7b355'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile
};