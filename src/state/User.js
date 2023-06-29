import { defineStore } from "pinia";
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { query, limit, where, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/utils/firebase/init";
import Swal from "sweetalert2";
import router from "@/router";
import ChatStore from "./Chat";

const UserStore = defineStore("user", {
    state: () => ({
        firebaseID: "",
        displayName: "",
        email: "",
        photoURL: "",
        uid: "",
        inviteID: "",
        chats: [],
        authenticated: false,
        snapUser: ""
    }),
    actions: {
        signInWithEmail(email, password) {
            this.emitter.emit("isLoading", true); 
            let auth = getAuth();

            onAuthStateChanged(getAuth(), user => {
                if (!user) {
                    if (this.snapUser) this.snapUser();
                }
            })
            
            signInWithEmailAndPassword(auth, email, password).then(async res => {
                const q = query(collection(db, "users"), where("email", "==", email), limit(1));

                if (this.snapUser) this.snapUser();

                this.snapUser = onSnapshot(q, snapShot => {
                    if (!snapShot.size) {
                        this.snapUser();
                        router.push({name: 'login'});
                        this.emitter.emit("loginError", "Email Or Password Doesn't Exist!");
                        this.emitter.emit("isLoading", false);
                        return;
                    }
                    this.chats = [];
                    this.$patch({
                        firebaseID: snapShot.docs[0].id,
                        displayName: snapShot.docs[0].data().displayName,
                        email: snapShot.docs[0].data().email,
                        photoURL: snapShot.docs[0].data().photoURL,
                        uid: snapShot.docs[0].data().uid,
                        inviteID: snapShot.docs[0].data().inviteID,
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

                console.log(err)

                this.emitter.emit("loginError", "Something Went Wrong");
            });
        },
        logout() {
            const chat = ChatStore();
            const auth = getAuth();
            signOut(auth).then(() => {
                router.push({name: 'login'});
                this.$reset()
                chat.$reset()
                chat.snapUsers();
                Swal.fire({
                    icon: "success",
                    title: "Success Logout",
                    timer: 3000
                })
            }).catch(err => console.log(err));
        }
    }
});

export default UserStore;