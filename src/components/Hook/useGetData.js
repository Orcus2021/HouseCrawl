import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDocs,
  getDoc,
  collection,
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

const useGetData = (url, method) => {
  const [onceData, setOnceData] = useState({});
  const [allData, setAllData] = useState([]);
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

    const getAllDocOnce = async (url) => {
      let dataObj = {};
      let dataArr = [];

      const docRef = collection(db, url);

      const docSnap = await getDocs(docRef);
      docSnap.forEach((doc) => {
        dataObj = doc.data();

        dataObj.keyId = doc.id;
        dataArr.push(dataObj);
      });
      if (isMounted) {
        setAllData(dataArr);
      }
    };

    if (method === "aDoc") {
      getDocOnce(url);
    } else if (method === "allDocs") {
      getAllDocOnce(url);
    }

    return () => {
      isMounted = false;
    };
  }, [url, method, db]);

  return { onceData, allData };
};

export default useGetData;
