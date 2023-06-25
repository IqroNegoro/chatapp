<template>
    <main>
        <div class="layout">
            <!-- Start of Navigation -->
            <div class="navigation">
                <div class="container">
                    <div class="inside">
                        <div class="nav nav-tab menu">
                            <button class="btn">
                                <img class="avatar-xl" :src="user.photoURL || 'img/noimage.png'" referrerpolicy="no-referrer" alt="avatar">
                            </button>
                            <a href="#discussions" data-toggle="tab" class="active"><i
                                    class="material-icons active">chat_bubble_outline</i></a>
                            <button class="btn power" @click="user.logout"><i
                                    class="material-icons">power_settings_new</i></button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- End of Navigation -->
            <!-- Start of Sidebar -->
            <div class="sidebar" id="sidebar">
                <div class="container">
                    <div class="col-md-12">
                        <div class="tab-content">
                            <!-- Start of Discussions -->
                            <div id="discussions" class="tab-pane fade active show">
                                <div class="search">
                                    <form class="form-inline position-relative">
                                        <input type="search" class="form-control" id="conversations"
                                            placeholder="Search for conversations...">
                                        <button type="button" class="btn btn-link loop"><i
                                                class="material-icons">search</i></button>
                                    </form>
                                    <button class="btn create" @click="createStatus = true"><i class="material-icons">create</i></button>
                                </div>
                                <div class="discussions">
                                    <h1>Discussions</h1>
                                    <Chats v-for="chats in chats.sort((a,b) => b.lastMessageAt - a.lastMessageAt)" :key="chats.id" :chats="chats" @chat-id="id => chatId = id" />
                                    <div v-if="!chats.length">
                                        <p class="text-center">There No Discussions Yet</p>
                                        <p class="text-center">Create New Chat!</p>
										<button class="mx-auto block px-2 pt-1 shadow-sm rounded-full mt-2 outline-none" @click="createStatus = true"><i class="bx bx-pencil text-2xl"></i></button>
                                    </div>
                                </div>
                            </div>
                            <!-- End of Discussions -->
                        </div>
                    </div>
                </div>
            </div>
            <!-- End of Sidebar -->
            <Create v-if="createStatus" @close="createStatus = false" />
        <KeepAlive :max="3">
            <Chat v-if="chatId" :key="chatId" :chatId="chatId" :profile="chats.find(v => v.id == chatId).member" />
        </KeepAlive>
        <div v-if="!chatId" class="w-full hidden lg:flex justify-center items-center h-screen">
            <h1>Start Conversation At Left</h1>
        </div>
    </div> <!-- Layout -->
</main></template>
<script>
import UserStore from "@/state/User";
import ChatStore from "@/state/Chat";
import Chat from "@/components/Sidebar/Chat";
import Chats from "@/components/Sidebar/Chats";
import Create from "@/components/Chats/Create";
import { onMounted, ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
export default {
    name: "Home",
    components: {
        Chat,
        Chats,
        Create
    },
    setup() {
        const user = UserStore();
        const chat = ChatStore();
        let chats = computed(() => chat.chats);
        let chatId = ref(null);
        let createStatus = ref(false);
        // let q = "";

        onMounted(() => {
            watch(() => storeToRefs(user.chats), () => {
                chat.getChats();
            }, {
                immediate: true
            })
            // q = query(collection(db, "chats"), where(documentId(), "in", user.chats))
            // onSnapshot(q, snapShot => {
            //     snapShot.docChanges().forEach(snap => {
            //         if (snap.type === "added") {
            //             chats.value.push({
            //                 id: snap.doc.id,
            //                 lastMessageAt: snap.doc.data().lastMessageAt,
            //                 lastMessage: snap.doc.data().lastMessage,
            //                 member: snap.doc.data().members.find(v => v.id != user.firebaseID)
            //             })
            //         }
            //         if (snap.type === "modified") {
            //             let indexModified = chats.value.findIndex(v => v.id == snap.doc.id);
            //             if (indexModified != -1) {
            //                 chats.value[indexModified].lastMessage = snap.doc.data().lastMessage;
            //                 chats.value[indexModified].lastMessageAt = snap.doc.data().lastMessageAt;
            //             }
            //         }
            //         if (snap.type === "removed") {
            //             chats.value.splice(chats.value.findIndex(v => v.id == snap.doc.id), 1)
            //         }
            //     });
            // }, error => {
            //     console.log(error)
            // })
        });

        return { user, chatId, chats, createStatus }
    }
}
</script>