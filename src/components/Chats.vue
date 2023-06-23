<template>
    <div class="list-group" id="chats" role="tablist" @click="$emit('chatId', chats.id)">
        <a href="#list-chat" class="filterDiscussions all unread single active" id="list-chat-list" data-toggle="list"
            role="tab">
            <img class="avatar-md" :src="chats.member.photoURL" data-toggle="tooltip" data-placement="top"
                :title="chats.displayName" alt="avatar" referrerpolicy="no-referrer">
            <!-- <div class="status">
                    <i class="material-icons online">fiber_manual_record</i>
                </div> -->
            <!-- <div class="new bg-yellow">
                    <span>+7</span>
                </div> -->
            <div class="data truncate">
                <h5>{{ chats.member.displayName }}</h5>
                <span>{{ moment().calendar(chats.lastMessageAt) }}</span>
                <p class="truncate">{{ chats.lastMessage }}</p>
            </div>
        </a>
    </div>
</template>
<script>
import moment from "moment";
export default {
    name: "Chats",
    props: ["chats"],
    setup() {
        return { moment }
    }
}
</script>