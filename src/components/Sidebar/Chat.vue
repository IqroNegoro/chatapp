<template>
    <div class="main m-lg:fixed m-lg:top-0 m-lg:left-0 m-lg:z-[99999999]">
        <div class="tab-content" id="nav-tabContent">
            <!-- Start of Babble -->
            <div class="babble tab-pane fade active show" id="list-chat" role="tabpanel" aria-labelledby="list-chat-list">
                <!-- Start of Chat -->
                <div class="chat" id="chat1">
                    <div class="top">
                        <div class="container">
                            <div class="col-md-12">
                                <div class="inside">
                                    <button @click="$emit('back')">
                                        <i class="bx bx-arrow-back text-2xl text-black mr-2 cursor-pointer"></i>
                                    </button>
                                    <a href="#"><img class="avatar-md" :src="profile.photoURL" referrerpolicy="no-referrer"
                                            data-toggle="tooltip" data-placement="top" title="Keith" alt="avatar"></a>
                                    <div class="data">
                                        <h5><a href="#">{{ profile.displayName }}</a></h5>
                                    </div>
                                    <div class="dropdown">
                                        <button class="btn" data-toggle="dropdown" aria-haspopup="true"
                                            aria-expanded="false"><i class="material-icons md-30">more_vert</i></button>
                                        <div class="dropdown-menu dropdown-menu-right">
                                            <button class="dropdown-item" @click="deleteChat"><i class="material-icons">delete</i>Delete
                                                Contact</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="content" id="content" v-if="chats" ref="container">
                        <div class="container">
                            <div class="col-md-12">
                                <div ref="infiniteScroll" class="wave w-full flex items-center justify-center"
                                    id="infiniteScroll" :class="{ 'hidden': showInfinite }"></div>
                                <p class="text-center" v-if="showInfinite">Ini Chat Terakhir Mu</p>
                                <Message v-for="chats in chats.sort((a, b) => a.sendAt - b.sendAt)" :key="chats.id"
                                    :chatId="chatId" :message="chats" @delete-message="handleDeleteMessage" />
                            </div>
                        </div>
                    </div>
                    <Input :messageId="chatId" @down="container.scrollTo(0, container.scrollHeight)" />
                </div>
                <!-- End of Chat -->
            </div>
        </div>
    </div>
</template>
<script>
import { ref, onMounted, onDeactivated, onUnmounted } from "vue";
import { collection, limit, onSnapshot, query, orderBy, getCountFromServer, doc, deleteDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import Message from "@/components/Chats/Message";
import Input from "@/components/Chats/Input";
import moment from "moment/moment";
import { db, storage  } from '@/utils/firebase/init';
import UserStore from "@/state/User";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Swal from 'sweetalert2';
import { deleteObject, ref as storageRef } from "firebase/storage";

export default {
    name: "Chat",
    components: {
        Message,
        Input
    },
    props: ["chatId", "profile"],
    setup({ chatId, profile }, {emit}) {
        const user = UserStore();
        let LIMIT_DOCS = 0;
        let container = ref(null);
        let infiniteScroll = ref(null);
        let showInfinite = ref(false);
        let snap = "";
        let chats = ref([]);

        onAuthStateChanged(getAuth(), user => {
            if (!user) {
                if (snap) snap();
            }
        })

        onUnmounted(() => {
            if (snap) snap();
        });

        onMounted(() => {
            let observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(async v => {
                    if (v.isIntersecting && v.target.id == "infiniteScroll") {
                        LIMIT_DOCS += 10;
                        const q = query(collection(db, "messages", chatId, "messages"), limit(LIMIT_DOCS), orderBy("sendAt", "desc"))
                        let totalCollection = await getCountFromServer(q);
                        if (chats.value.length == 0 || totalCollection.data().count != chats.value.length) {
                            if (snap) snap();
                            snap = onSnapshot(q, snapShot => {
                                snapShot.docChanges().forEach(snap => {
                                    if (snap.type === "added") {
                                        let indexChat = chats.value.findIndex(v => v.id == snap.doc.id);
                                        if (indexChat == -1) {
                                            chats.value.unshift({
                                                id: snap.doc.id,
                                                sendAt: snap.doc.data().sendAt,
                                                message: snap.doc.data().message,
                                                isRead: snap.doc.data().isRead,
                                                uid: snap.doc.data().uid,
                                                type: snap.doc.data().type,
                                                url: snap.doc.data().type == 'image' ? snap.doc.data().url : "",
                                                pathImage: snap.doc.data().type == 'image' ? snap.doc.data().pathImage : ""
                                            })
                                        }
                                    }
                                    if (snap.type === "modified") {
                                        let indexModified = chats.value.findIndex(v => v.id == snap.doc.id);
                                        if (indexModified != -1) {
                                            chats.value.splice(indexModified, 1, { ...snap.doc.data(), id: snap.doc.id, sendAt: snap.doc.data().sendAt })
                                        }
                                    }
                                    if (snap.type === "removed") {
                                        chats.value.splice(chats.value.findIndex(v => v.id == snap.doc.id), 1)
                                    }
                                });
                            }, error => {
                                Swal.fire({
                                    icon: "error",
                                    title: "Something Went Wrong",
                                    timer: 3000
                                })
                            })
                        } else {
                            showInfinite.value = true;
                        }
                    }
                })
            }, {
                root: container.value,
                rootMargin: "0px",
                threshold: 1
            });

            observer.observe(infiniteScroll.value)
            setTimeout(() => container.value?.scrollTo(0, 9999), 1500)
        })

        let handleClick = e => {
            let activeDropdown = document.querySelectorAll(".dropdown.absolute");
            if (activeDropdown.length) {
                activeDropdown.forEach(v => {
                    v.classList.add("hidden");
                })
            }
        }

        const deleteChat = async () => {
            let id = chatId;
            emit("back");
            let updatingUser = await updateDoc(doc(db, "users", user.firebaseID), {
                chats: arrayRemove(chatId)
            });
        }

        let handleDeleteMessage = async id => {
            try {
                let findChat = chats.value.find(v => v.id == id);
                let itsLatestMessage = chats.value[chats.value.length - 1];
                if (findChat.type == 'image') {
                    deleteObject(storageRef(storage, `image/${findChat.pathImage}`));
                }
                let deletedDoc = await deleteDoc(doc(db, "messages", chatId, "messages", id))
                if (itsLatestMessage.id == id) {
                    let updateLatestMessage = updateDoc(doc(db, "chats", chatId), {
                        lastMessageAt: +new Date(),
                        lastMessage: "Deleted Chat"
                    })
                }
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Something Went Wrong",
                    timer: 3000
                })
            }
        }

        onMounted(() => {
            document.addEventListener("contextmenu", handleClick)
            document.addEventListener("click", handleClick)
        })

        onDeactivated(() => {
            document.removeEventListener("contextmenu", handleClick);
            document.removeEventListener("click", handleClick);
        })

        return { chats, user, moment, container, infiniteScroll, showInfinite, handleDeleteMessage, deleteChat }
    }
}
</script>