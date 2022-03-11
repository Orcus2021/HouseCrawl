import React, { useCallback, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  connectFirestoreEmulator,
  getDoc,
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

const useGetData = (url) => {
  const [onceData, setOnceData] = useState({});
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  useEffect(() => {
    let isMounted = true;
    const getDocOnce = async (url) => {
      let dataObj = {};
      const docRef = doc(db, url);

      const docSnap = await getDoc(docRef);
      dataObj = docSnap.data();
      dataObj.keyId = docSnap.id;
      if (isMounted) {
        setOnceData(dataObj);
      }
    };

    getDocOnce(url);
    return () => {
      isMounted = false;
    };
  }, [url]);

  return { onceData };
};

export default useGetData;
