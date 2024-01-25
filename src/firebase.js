import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut
} from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZDpdor94s3WpmE0JbMkGQ57ttTd-J5po",
  authDomain: "fbui-react.firebaseapp.com",
  databaseURL: "https://fbui-react-default-rtdb.firebaseio.com",
  projectId: "fbui-react",
  storageBucket: "fbui-react.appspot.com",
  messagingSenderId: "305831066235",
  appId: "1:305831066235:web:c6ad8254ae9315c8b240de",
  measurementId: "G-NDNND3KPDR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
//connectAuthEmulator(auth, "http://127.0.0.1:9099");
const db = getFirestore(app);
const analytics = getAnalytics(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    // we dont have a user record in firestore
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
      }).catch((err) => {
        console.error(err);
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);  
};

export {
  app, auth, analytics,
  db, logout, signInWithGoogle
};

