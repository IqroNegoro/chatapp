import { defineStore } from "pinia";
import { query, where, collection, documentId, onSnapshot, updateDoc, arrayUnion, addDoc, doc } from "firebase/firestore";
import { db } from "@/utils/firebase/init";
import UserStore from "@/state/User";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ChatStore = defineStore("chat", {
    state: () => ({
        chats: [],
        snapChats: "",
        snapUsers: ""
    }),
    actions: {
        getChats() {
            const user = UserStore();
            let q = "";
            
            onAuthStateChanged(getAuth(), loggedUser => {
                if (!loggedUser) {
                    if (this.snapChats) this.snapChats();
                    if (this.snapUsers) this.snapUsers();
                } else {
                    if (this.snapChats) this.snapChats();
                    if (this.snapUsers) this.snapUsers();
                    this.chats = [];
                    q = query(collection(db, "chats"), where(documentId(), "in", user.chats))
                    this.snapChats = onSnapshot(q, snapShot => {
                        snapShot.docChanges().forEach(snap => {
                            if (snap.type === "added") {
                                let data = {
                                    id: snap.doc.id,
                                    lastMessageAt: snap.doc.data().lastMessageAt,
                                    lastMessage: snap.doc.data().lastMessage,
                                    member: snap.doc.data().members.find(v => v != user.firebaseID),
                                }
                                this.chats.push(data);
                                this.snapUsers = onSnapshot(doc(db, "users", data.member), userSnap => {
                                    let findChat = this.chats.find(v => v.member == userSnap.id || v.member.id == userSnap.id);
                                    if (findChat) {
                                        findChat.member = {
                                            id: userSnap.id,
                                            displayName: userSnap.data().displayName,
                                            photoURL: userSnap.data().photoURL,
                                        }
                                    }
                                })
                            }
                            if (snap.type === "modified") {
                                let indexModified = this.chats.findIndex(v => v.id == snap.doc.id);
                                if (indexModified != -1) {
                                    this.chats[indexModified].lastMessage = snap.doc.data().lastMessage;
                                    this.chats[indexModified].lastMessageAt = snap.doc.data().lastMessageAt;
                                    let tempOne;
                                    let tempTwo;
                                    tempOne = this.chats[0]
                                    this.chats[0] = this.chats[indexModified];
                                    for (let i = 1; i <= indexModified; i++) {
                                        tempTwo = tempOne;
                                        tempOne = this.chats[i];
                                        this.chats[i] = tempTwo;
                                    }
                                }
                            }
                            if (snap.type === "removed") {
                                this.chats.splice(this.chats.findIndex(v => v.id == snap.doc.id), 1)
                            }
                        });
                    }, error => {
                        this.emitter.emit("isLoading", false)
                        Swal.fire({
                            icon: "error",
                            title: "Something Went Wrong",
                            timer: 3000
                        })
                    })
                }
            })

        },
        async addChat(message, searchedUser) {
            try {
            this.emitter.emit("isLoading", true);
            const user = UserStore();
            let creatingChat = await addDoc(collection(db, "chats"), {
                lastMessage: message,
                lastMessageAt: +new Date(),
                members: [
                    user.firebaseID,
                    searchedUser.id
                    // {
                    //     displayName: user.displayName,
                    //     id: user.firebaseID,
                    //     photoURL: user.photoURL
                    // },
                    // {
                    //     displayName: searchedUser.displayName,
                    //     id: searchedUser.id,
                    //     photoURL: searchedUser.photoURL
                    // }
                ]
            })
            if (creatingChat.id) {
                let updatingCurrentUser = await updateDoc(doc(db, "users", searchedUser.id), {
                    chats: arrayUnion(creatingChat.id)
                });
                let updatingSearchedUser = await updateDoc(doc(db, "users", user.firebaseID), {
                    chats: arrayUnion(creatingChat.id)
                });
                let createMessages = await addDoc(collection(db, "messages", creatingChat.id, "messages"), {
                    isRead: false,
                    message: message,
                    sendAt: +new Date(),
                    uid: user.uid,
                    type: "text",
                });
                user.chats.push(creatingChat.id);
                this.emitter.emit("addChatSuccess");
                this.emitter.emit("isLoading", false);
            }
        } catch (err) {
            this.emitter.emit("isLoading", false);
            Swal.fire({
                icon: "error",
                title: "Something Went Wrong",
                timer: 3000
            })
        }
        }
    }
});

export default ChatStore;