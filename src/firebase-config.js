import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCKyATnmxrF8nMucR0dvaH68SaVavbsxPY",
  authDomain: "web-links-ad2ee.firebaseapp.com",
  projectId: "web-links-ad2ee",
  storageBucket: "web-links-ad2ee.appspot.com",
  messagingSenderId: "941428025847",
  appId: "1:941428025847:web:6ec2d6642b1732155266f2"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();