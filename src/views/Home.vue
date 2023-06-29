<template>
    <div class="sidebar" id="sidebar">
        <div class="container">
            <div class="col-md-12">
                <div class="tab-content">
                    <!-- Start of Discussions -->
                    <div id="discussions" class="tab-pane fade active show">
                        <div class="search">
                            <form class="form-inline position-relative">
                                <input type="search" class="form-control" id="conversations"
                                    placeholder="Search for conversations..." v-model="searched">
                                <button type="button" class="btn btn-link loop"><i
                                        class="material-icons">search</i></button>
                            </form>
                            <button class="btn create" @click="createStatus = true"><i
                                    class="material-icons">create</i></button>
                        </div>
                        <div class="discussions">
                            <h1>Discussions</h1>
                            <TransitionGroup name="chats" tag="div" class="relative">
                                <Chats
                                v-for="chats in searched ? chats.filter(v => v.member.displayName.toLowerCase().indexOf(searched.toLowerCase()) != -1).sort((a, b) => b.lastMessageAt - a.lastMessageAt) : chats.sort((a, b) => b.lastMessageAt - a.lastMessageAt)"
                                :key="chats.id" :chats="chats" @chat-id="id => chatId = id" />
                            </TransitionGroup>
                            <div v-if="!chats.length">
                                <p class="text-center">There No Discussions Yet</p>
                                <p class="text-center">Create New Chat!</p>
                                <button class="mx-auto block px-2 pt-1 shadow-sm rounded-full mt-2 outline-none"
                                    @click="createStatus = true"><i class="bx bx-pencil text-2xl"></i></button>
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
    <Chat v-if="chatId" :key="chatId" :chatId="chatId" :profile="chats.find(v => v.id == chatId).member"
        @back="chatId = null" />
    <div v-if="!chatId" class="w-full hidden lg:flex justify-center items-center h-screen">
        <h1>Start Conversation At Left</h1>
    </div>
</template>
<script>
import UserStore from "@/state/User";
import ChatStore from "@/state/Chat";
import Chat from "@/components/Sidebar/Chat";
import Chats from "@/components/Sidebar/Chats";
import Create from "@/components/Chats/Create";
import { onMounted, ref, computed, watch, onUnmounted, onDeactivated } from "vue";
import { storeToRefs } from "pinia";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
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
        let searched = ref("");
        let chats = computed(() => chat.chats);
        let chatId = ref(null);
        let createStatus = ref(false);

        onMounted(() => {
            watch(() => storeToRefs(user.chats), () => {
                    chat.getChats();
            }, {
                immediate: true
            })
        });

        onUnmounted(() => chatId.value = null);

        onDeactivated(() => chatId.value = null);

        onAuthStateChanged(getAuth(), user => {
            if (!user) chatId.value = null;
        })

        return { user, chatId, chats, createStatus, searched }
    }
}
</script>

<style scoped>
.chats-enter-active {
  transition: all 0.5s ease;
}
.chats-enter-from {
  opacity: 0;
  transform: translateX(30px)
}
</style>