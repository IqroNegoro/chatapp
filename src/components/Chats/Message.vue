<template>
    <div class="message" :class="{ 'me': message.uid == user.uid }" :id="message.uid">
        <div class="text-main">
            <div class="text-group" :class="{ 'me': message.uid == user.uid }">
                <div class="text text-white" @click.prevent.stop="handleClick" @contextmenu.prevent.stop="handleClick">
                    <p v-if="message.type == 'text'" :class="{ 'read': message.isRead, 'notRead': !message.isRead }"
                        ref="textMessage">{{ message.message }}</p>
                    <img v-if="message.type == 'image'" :src="message.url" alt="" class="img-fluid">
                </div>
                <div class="dropdown hidden absolute" v-if="message.uid == user.uid">
                    <div class="dropdown-menu dropdown-menu-right show">
                        <button class="dropdown-item" @click="$emit('deleteMessage', message.id)"><i
                                class="material-icons">delete</i>Delete Chat</button>
                    </div>
                </div>
            </div>
            <span>
                {{ moment(message.sendAt).format('LT') }}
                <div class="inline" v-if="message.uid == user.uid">
                    <i v-if="message.isRead" class="bx bx-check-double text-blue-500"
                        :class="{ 'order-1': message.uid != user.uid }"></i>
                    <i v-else class="bx bx-check" :class="{ 'order-1': message.uid != user.uid }"></i>
                </div>
            </span>
        </div>
    </div>
</template>
<script>
import UserStore from "@/state/User";
import moment from "moment/moment";
import { db } from "@/utils/firebase/init";
import { onMounted, ref } from 'vue';
import { doc, updateDoc } from "firebase/firestore";
export default {
    name: "Message",
    props: ["message", "chatId"],
    setup({ message, chatId }) {
        const user = UserStore();
        let textMessage = ref(null);

        const handleClick = e => {
            e.target.nextElementSibling?.classList.remove('hidden');
        }

        onMounted(async () => {
            if (message.uid != user.uid) {
                await updateDoc(doc(db, "messages", chatId, "messages", message.id), {
                    isRead: true
                })
            }
        })

        return { user, handleClick, moment, textMessage }
    }
}
</script>