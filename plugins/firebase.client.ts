// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig()

    const firebaseConfig = {
        apiKey: "AIzaSyCKxEYUtxMrevfSLSRHKUHc7gKTSKBZ-Vg",
        authDomain: "somsritshirt-ced49.firebaseapp.com",
        databaseURL: "https://somsritshirt-ced49.firebaseio.com",
        projectId: "somsritshirt-ced49",
        storageBucket: "somsritshirt-ced49.appspot.com",
        messagingSenderId: "99816736698",
        appId: "1:99816736698:web:a5fb5f8f10194c8221ff83"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getDatabase();

    nuxtApp.vueApp.provide('app', app)
    nuxtApp.provide('app', app)

    nuxtApp.vueApp.provide('db', db)
    nuxtApp.provide('db', db)
})
