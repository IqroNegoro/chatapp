import { defineStore } from "pinia";
import { getAuth, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { query, limit, where, collection, getDocs, onSnapshot } from "firebase/firestore";
import  db from "@/utils/firebase/init";
import Swal from "sweetalert2";
import router from "@/router";

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
        // chats: ["empty"],
        // authenticated: true
    }),
    actions: {
        signInWithEmail(email, password) {
            this.emitter.emit("isLoading", true); 
            let auth = getAuth();
            let snap = "";
            signInWithEmailAndPassword(auth, email, password).then(async res => {
                const q = query(collection(db, "users"), where("email", "==", email), limit(1));

                snap = onSnapshot(q, snapShot => {
                    console.log(snapShot.size, snapShot.docs.length, snapShot.docs[0].data())
                    this.$patch({
                        firebaseID: snapShot.docs[0].id,
                        displayName: snapShot.docs[0].data().displayName,
                        email: snapShot.docs[0].data().email,
                        photoURL: snapShot.docs[0].data().photoURL,
                        uid: snapShot.docs[0].data().uid,
                        chats: snapShot.docs[0].data().chats,
                        authenticated: true
                    })
                    if (router.currentRoute.value.name == 'login') {
                        this.emitter.emit("isLoading", false);
                        Swal.fire({
                            icon: "success",
                            title: "Success",
                            timer: 3000
                        });
                        router.push({name: "home"});
                    }
                }, error => {
                    console.log(error)
                    this.emitter.emit("isLoading", false);
                    this.emitter.emit("loginError", "Something Went Wrong");
                })
            }).catch(err => {
                this.emitter.emit("isLoading", false);
                if (err.code == 'auth/wrong-password') {
                    this.emitter.emit("loginError", "Email Or Password Wrong!");
                    return;
                }

                if (err.code == 'auth/user-not-found') {
                    this.emitter.emit("loginError", "Account Doesnt Exists!");
                    return;
                }

                this.emitter.emit("loginError", "Something Went Wrong");
            });
        },
        logout() {
            const auth = getAuth();
            signOut(auth).then(() => {
                this.$patch({
                    firebaseID: "",
                    displayName: "",
                    email: "",
                    photoURL: "",
                    uid: "",
                    chats: [],
                    authenticated: false
                })
                Swal.fire({
                    icon: "success",
                    title: "Success Logout",
                    timer: 3000
                })
                router.push({name: 'login'});
            }).then(err => console.log(err));
        }
    }
});

export default UserStore;