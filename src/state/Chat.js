import { defineStore } from "pinia";
import { query, where, collection, documentId, onSnapshot, updateDoc, arrayUnion, addDoc, doc } from "firebase/firestore";
import { db } from "@/utils/firebase/init";
import UserStore from "@/state/User";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ChatStore = defineStore("chat", {
    state: () => ({
        chats: [],
        snapChats: ""
    }),
    actions: {
        getChats() {
            const user = UserStore();
            let q = "";
            
            onAuthStateChanged(getAuth(), loggedUser => {
                if (!loggedUser) {
                    if (this.snapChats) this.snapChats();
                } else {
                    if (this.snapChats) this.snapChats();
                    this.chats = [];
                    q = query(collection(db, "chats"), where(documentId(), "in", user.chats))
                    this.snapChats = onSnapshot(q, snapShot => {
                        snapShot.docChanges().forEach(snap => {
                            if (snap.type === "added") {
                                this.chats.push({
                                    id: snap.doc.id,
                                    lastMessageAt: snap.doc.data().lastMessageAt,
                                    lastMessage: snap.doc.data().lastMessage,
                                    member: snap.doc.data().members.find(v => v.id != user.firebaseID)
                                })
                            }
                            if (snap.type === "modified") {
                                let indexModified = this.chats.findIndex(v => v.id == snap.doc.id);
                                if (indexModified != -1) {
                                    this.chats[indexModified].lastMessage = snap.doc.data().lastMessage;
                                    this.chats[indexModified].lastMessageAt = snap.doc.data().lastMessageAt;
                                }
                            }
                            if (snap.type === "removed") {
                                this.chats.splice(this.chats.findIndex(v => v.id == snap.doc.id), 1)
                            }
                        });
                    }, error => {
                        console.log(error)
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
                    {
                        displayName: user.displayName,
                        id: user.firebaseID,
                        photoURL: user.photoURL
                    },
                    {
                        displayName: searchedUser.displayName,
                        id: searchedUser.id,
                        photoURL: searchedUser.photoURL
                    }
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
                    uid: user.uid
                });
                user.chats.push(creatingChat.id);
                this.emitter.emit("addChatSuccess");
                this.emitter.emit("isLoading", false);
            }
        } catch (err) {
            this.emitter.emit("isLoading", false);
            console.log(err)
        }
        }
    }
});

export default ChatStore;