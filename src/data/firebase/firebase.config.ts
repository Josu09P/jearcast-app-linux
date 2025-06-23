import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// CONFIG. OF FIREBASE APP
const firebaseConfig = {
  apiKey: "AIzaSyC7ns-CUWq64nPRvyJnzN1OFklPyWMGzT4",
  authDomain: "jearcastapp.firebaseapp.com",
  projectId: "jearcastapp",
  storageBucket: "jearcastapp.firebasestorage.app",
  messagingSenderId: "1084867568693",
  appId: "1:1084867568693:web:35dd7d6aa9005620ff7d7c"
};

// INIT FIREBASE APP
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);