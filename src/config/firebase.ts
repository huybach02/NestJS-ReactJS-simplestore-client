import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2ZnksWTYDvMt5kDHWhvqmMxNT2AgqDT8",
  authDomain: "simplestore-cc1f6.firebaseapp.com",
  projectId: "simplestore-cc1f6",
  storageBucket: "simplestore-cc1f6.firebasestorage.app",
  messagingSenderId: "159424504107",
  appId: "1:159424504107:web:3fbf252670baaa16e2256e",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);

firebaseAuth.languageCode = "vi";
