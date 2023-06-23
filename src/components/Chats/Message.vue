<template>
    <div class="message" :class="{'me': message.uid == user.uid}">
        <div class="text-main">
            <div class="text-group" :class="{'me': message.uid == user.uid}">
                <div class="text text-black" :class="{'me text-white': message.uid == user.uid}">
                    <p>{{message.message}}</p>
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

        return { user }
    }
}
</script>