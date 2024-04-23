import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwdebRgCVal2k4DDzIpYTdQ3ArETyjaII",
  authDomain: "ffd-5797d.firebaseapp.com",
  databaseURL: "https://ffd-5797d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ffd-5797d",
  storageBucket: "ffd-5797d.appspot.com",
  messagingSenderId: "557009303146",
  appId: "1:557009303146:web:54e154afd507997e33fc13",
  measurementId: "G-GV65RCXL6S"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export default app;
