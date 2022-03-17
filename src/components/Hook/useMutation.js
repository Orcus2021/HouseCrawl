import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  addDoc,
  updateDoc,
  collection,
  deleteDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL:
    "https://crawl-e3835-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
};

const useMutation = () => {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const addCollectionData = async (data, url) => {
    let refUrl = url;

    let collRef = await collection(db, refUrl);
    await addDoc(collRef, data);
  };

  const updateFieldData = async (data, url) => {
    const ref = doc(db, url);

    await updateDoc(ref, data);
  };

  const deleteDocData = async (url) => {
    const ref = doc(db, url);
    await deleteDoc(ref);
  };
  return { addCollectionData, updateFieldData, deleteDocData };
};

export default useMutation;
