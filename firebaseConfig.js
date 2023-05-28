// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBeG2oEughmi1q0bhekftZMFj6fW4Dz2JU",
  authDomain: "learndo-39568.firebaseapp.com",
  projectId: "learndo-39568",
  storageBucket: "learndo-39568.appspot.com",
  messagingSenderId: "1091951711383",
  appId: "1:1091951711383:web:08e6f6dc058ef58d3845d2",
  measurementId: "G-X5WRH31S2N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const storage = getStorage(app);
export default storage;