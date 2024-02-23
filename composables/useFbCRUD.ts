import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, get, set } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth"

export default function () {
    const config = useRuntimeConfig()
    const firebaseConfig = {
        apiKey: config.public.apiKey,
        authDomain: config.public.authDomain,
        databaseURL: config.public.databaseURL,
        projectId: config.public.projectId,
        storageBucket: config.public.storageBucket,
        messagingSenderId: config.public.messagingSenderId,
        appId: config.public.appId
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app)
    const signIn = signInWithEmailAndPassword
    const logOut = signOut
    const checkAuth = onAuthStateChanged

    const db = getDatabase();
    const dbRef = ref;
    const getData = get;
    const setData = set;

    return { db, dbRef, getData, onValue, setData, auth, signIn, checkAuth, logOut }
}