import { defineStore } from "pinia";

const UserStore = defineStore("user", {
    state: () => ({
        firebaseID: "",
        displayName: "",
        email: "",
        photoURL: "",
        uid: "",
        chats: [],
        authenticated: false
        // firebaseID: "BRk1UyR54mjdXf7B2RES",
        // displayName: "Iqro Negoro",
        // email: "iqronegoro0@gmail.com",
        // photoURL: "https://lh3.googleusercontent.com/ogw/AOLn63FCn3w-TTL2XCnc4E1xLyNKRLJN1NwkzJDpCDD5jA=s128-c-mo",
        // uid: "L6FEsIR3Tch2bTij3JWdvmcNff13",
        // chats: ["dp6d2qa6JJFt1rPpvlF5", "sBsJQRpIMZEtUhjiSuUg"],
        // authenticated: true
    }),
});

export default UserStore;