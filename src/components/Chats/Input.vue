<template>
    <div class="container">
        <div class="col-md-12">
            <div class="bottom">
                <form class="position-relative w-100" @submit.prevent="handleSubmit">
                    <textarea class="form-control" style="color: black" placeholder="Start typing for reply..." rows="1" v-model="message"></textarea>
                    <button type="submit" class="btn send" @click.prevent="handleSubmit"><i class="material-icons">send</i></button>
                </form>
                <label>
                    <input type="file">
                    <span class="btn attach d-sm-block d-none"><i class="material-icons">attach_file</i></span>
                </label> 
            </div>
        </div>
    </div>
</template>
<script>
import { computed, ref } from 'vue'
import db from "@/utils/firebase/init";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import UserStore from '@/state/User';
export default {
    name: "Input",
    props: ["messageId"],
    setup({messageId}) {
        const user = UserStore();
        let message = ref("");
        let id = computed(() => messageId);

        const handleSubmit = async () => {
            try {
                const docs = await addDoc(collection(db, "messages", messageId, "messages"), {
                    sendAt: +new Date(),
                    message: message.value,
                    isRead: false,
                    uid: user.uid
                })

                const updateLastMessage = await updateDoc(doc(db, "chats", messageId), {
                    lastMessageAt: +new Date(),
                    lastMessage: message.value
                });
                message.value = "";
            } catch (err) {
                console.log(err)
            }
        }

        return { message, handleSubmit, id }
    }
}
</script>