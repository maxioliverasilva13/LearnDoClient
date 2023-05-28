import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, TwitterAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { firebaseConfig } from "./firebaseConfig";
import { FacebookAuthProvider } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const signInWithFacebook = async () => {
  try {
    const res = await signInWithPopup(auth, facebookProvider);
    const user = res.user;
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const signInWithTwitter = async () => {
  try {
    const provider = new TwitterAuthProvider();

    const res = await signInWithPopup(auth, provider);
    const user = res.user;
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
};
