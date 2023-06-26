<template>
    <div class="fixed top-0 left-0 bg-black bg-opacity-50 w-full h-screen z-[9992]">
        <div class="modal fade show" id="startnewchat" tabindex="-1" role="dialog" style="display: block">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="requests">
                    <div class="title">
                        <h1>Start new chat</h1>
                        <button type="button" class="btn" data-dismiss="modal" aria-label="Close" @click="$emit('close')"><i class="material-icons">close</i></button>
                    </div>
                    <div class="content" v-if="!searchedUser">
                        <form @submit.prevent="handleSubmit">
                            <div class="form-group">
                                <label for="participant">Invite ID</label>
                                <input type="text" class="form-control" id="participant" placeholder="Invite ID..." v-model="inviteID" required>
                            </div>
                            <div class="form-group">
                                <label for="message">Message:</label>
                                <textarea class="text-control" id="message" placeholder="Send your welcome message..." v-model="message">Hmm, are you friendly?</textarea>
                            </div>
                            <button type="submit" class="btn button w-100" @submit.prevent="handleSubmit">Start New Chat</button>
                        </form>
                    </div>
                    <div v-else class="w-full shadow-md bg-white rounded-sm flex justify-center items-center flex-col p-4">
                        <img class="w-20 rounded-full" :src="searchedUser.photoURL || 'img/noimage.png'" alt="" referrerpolicy="no-referrer">
                        <p class="text-center text-black text-xl">{{ searchedUser.displayName }}</p>
                        <p class="mt-2">Are You Sure This Is The Person?</p>
                        <div class="flex justify-center items-center gap-4 mt-4">
                            <button class="text-xl bg-blue-500 rounded-sm text-white py-1 px-3 outline-none" @click="chat.addChat(message, searchedUser)">
                                Sure
                            </button>
                            <button class="text-xl bg-red-500 rounded-sm text-white py-1 px-3 outline-none" @click="searchedUser = null">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import UserStore from '@/state/User'
import ChatStore from '@/state/Chat'
import {db} from "@/utils/firebase/init";
import { ref, inject } from "vue";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import Swal from 'sweetalert2';
export default {
    name: "Create",
    setup(props, {emit}) {
        const user = UserStore();
        const chat = ChatStore();
        let inviteID = ref("");
        let message = ref("");
        let emitter = inject("emitter")
        let searchedUser = ref(null);
        
        const handleSubmit = async () => {
            try {
                emitter.emit("isLoading", true);
                const q = query(collection(db, "users"), where("inviteID", "==", inviteID.value), limit(1));
    
                const user = await getDocs(q);
    
                if (!user.empty) {
                    user.forEach(v => searchedUser.value = {id: v.id, ...v.data()});
                    emitter.emit("isLoading", false);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "User Not Found!",
                        timer: 3000,
                        customClass: {
                            container: "z-[9992]"
                        }
                    })
                    emitter.emit("isLoading", false);
                }
            } catch (err) {
                console.log(err)
            }
        }

        emitter.on("addChatSuccess", () => emit("close"))

        return { user, inviteID, message, handleSubmit, searchedUser, chat }
    }
}
</script>