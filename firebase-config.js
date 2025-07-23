// firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQRLf2uCKnD6SmISmyGjmZmiF542xyKsE",
  authDomain: "fir-authentication-syste-cf6bd.firebaseapp.com",
  projectId:"fir-authentication-syste-cf6bd",
  storageBucket: "fir-authentication-syste-cf6bd.firebasestorage.app",
  messagingSenderId:"108907873313",
  appId:  "1:108907873313:web:1764ee75a74531ba260f60",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
 