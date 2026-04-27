import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCvQxU33JFiLGfC0soz1zVOr4TzF04dkVk",
  authDomain: "crisis-simulator-ecc1b.firebaseapp.com",
  projectId: "crisis-simulator-ecc1b",
  storageBucket: "crisis-simulator-ecc1b.firebasestorage.app",
  messagingSenderId: "196844035482",
  appId: "1:196844035482:web:effc6fdc8fb9763f666e23",
  measurementId: "G-WEMR34HYNY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCvQxU33JFiLGfC0soz1zVOr4TzF04dkVk",
//   authDomain: "crisis-simulator-ecc1b.firebaseapp.com",
//   projectId: "crisis-simulator-ecc1b",
//   storageBucket: "crisis-simulator-ecc1b.firebasestorage.app",
//   messagingSenderId: "196844035482",
//   appId: "1:196844035482:web:effc6fdc8fb9763f666e23",
//   measurementId: "G-WEMR34HYNY"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);