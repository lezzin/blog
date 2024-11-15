import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA74WsXa-NKzIKVS7ktO1ZYUHHyf0NGZx4",
    authDomain: "blog-wellyngton-53e0b.firebaseapp.com",
    projectId: "blog-wellyngton-53e0b",
    storageBucket: "blog-wellyngton-53e0b.appspot.com",
    messagingSenderId: "528983514450",
    appId: "1:528983514450:web:f16e922423f9ba06982e8b",
    measurementId: "G-YQ72VJ2SF5"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

getAnalytics(app);

export {
    db,
    auth,
    storage
}

