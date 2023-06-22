import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDN5KSPkN7DtTh4WKoryjRO4JihojPJclg",
    authDomain: "chat-5064d.firebaseapp.com",
    projectId: "chat-5064d",
    storageBucket: "chat-5064d.appspot.com",
    messagingSenderId: "561818527881",
    appId: "1:561818527881:web:7c1e6faa58bb143665be58"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;