<template>
    <div class="list-group" id="chats" role="tablist" @click="$emit('chatId', chats.id)">
        <a href="#list-chat" class="filterDiscussions all unread single active" id="list-chat-list" data-toggle="list"
            role="tab">
            <img class="avatar-md" :src="chats.member.photoURL || 'img/noimage.png'" data-toggle="tooltip" data-placement="top"
                :title="chats.displayName" alt="avatar" referrerpolicy="no-referrer">
            <div class="data truncate">
                <h5>{{ chats.member.displayName }}</h5>
                <span>{{ moment(chats.lastMessageAt).calendar() }}</span>
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