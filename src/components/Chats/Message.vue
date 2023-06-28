<template>
    <div class="message" :class="{'me': message.uid == user.uid}">
        <div class="text-main">
            <div class="text-group" :class="{'me': message.uid == user.uid}">
                <div class="text text-white" :class="{'me text-white': message.uid == user.uid}" :id="message.id" @click.prevent.stop="handleClick" @contextmenu.prevent.stop="handleClick">
                    <p v-if="message.type == 'text'">{{message.message}}</p>
                    <img v-else :src="message.url" alt="" class="w-1/2">
                </div>
                <div class="dropdown hidden absolute" v-if="message.uid == user.uid">
                    <div class="dropdown-menu dropdown-menu-right show">
                        <button class="dropdown-item" @click="$emit('deleteMessage', message.id)"><i class="material-icons">delete</i>Delete Chat</button>
                    </div>
                </div> 
            </div>
            <!-- <span>{{message.sendAt}}</span> -->
        </div>
        <!-- SET DATE -->
    <!-- <div class="date">
             <hr>
            <span>Today</span>
            <hr>
        <div> -->
    </div>
</template>
<script>
import UserStore from "@/state/User";
export default {
    name: "Message",
    props: ["message"],
    setup({message}) {
        const user = UserStore();
        console.log(message)
        const handleClick = e => {
            e.target.nextElementSibling?.classList.remove('hidden');
        }

        return { user, handleClick }
    }
}
</script>