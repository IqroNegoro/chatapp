<template>
    <div class="main">
        <div class="tab-content" id="nav-tabContent">
            <!-- Start of Babble -->
            <div class="babble tab-pane fade active show" id="list-chat" role="tabpanel" aria-labelledby="list-chat-list">
                <!-- Start of Chat -->
                <div class="chat" id="chat1">
                    <div class="top">
                        <div class="container">
                            <div class="col-md-12">
                                <div class="inside">
                                    <a href="#"><img class="avatar-md" :src="profile.photoURL" referrerpolicy="no-referrer" data-toggle="tooltip" data-placement="top" title="Keith" alt="avatar"></a>
                                    <div class="status">
                                        <i class="material-icons online">fiber_manual_record</i>
                                    </div>
                                    <div class="data">
                                        <h5><a href="#">{{profile.displayName}}</a></h5>
                                        <span>Active now</span>
                                    </div>
                                    <!-- <button class="btn connect d-md-block d-none" name="1"><i class="material-icons md-30">phone_in_talk</i></button>
                                    <button class="btn connect d-md-block d-none" name="1"><i class="material-icons md-36">videocam</i></button>
                                    <button class="btn d-md-block d-none"><i class="material-icons md-30">info</i></button> -->
                                    <div class="dropdown">
                                        <button class="btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="material-icons md-30">more_vert</i></button>
                                        <div class="dropdown-menu dropdown-menu-right">
                                            <button class="dropdown-item connect" name="1"><i class="material-icons">phone_in_talk</i>Voice Call</button>
                                            <button class="dropdown-item connect" name="1"><i class="material-icons">videocam</i>Video Call</button>
                                            <hr>
                                            <button class="dropdown-item"><i class="material-icons">clear</i>Clear History</button>
                                            <button class="dropdown-item"><i class="material-icons">block</i>Block Contact</button>
                                            <button class="dropdown-item"><i class="material-icons">delete</i>Delete Contact</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="content" id="content" v-if="chats">
                        <div class="container">
                            <div class="col-md-12">
                                <Message v-for="chats in chats" :key="chats.id" :message="chats" />
                            </div>
                        </div>
                    </div>
                    <Input :messageId="chatId" />
                </div>
                <!-- End of Chat -->
                <!-- Start of Call -->
                <div class="call" id="call1">
                    <div class="content">
                        <div class="container">
                            <div class="col-md-12">
                                <div class="inside">
                                    <div class="panel">
                                        <div class="participant">
                                            <img class="avatar-xxl" src="dist/img/avatars/avatar-female-5.jpg" alt="avatar">
                                            <span>Connecting</span>
                                        </div>							
                                        <div class="options">
                                            <button class="btn option"><i class="material-icons md-30">mic</i></button>
                                            <button class="btn option"><i class="material-icons md-30">videocam</i></button>
                                            <button class="btn option call-end"><i class="material-icons md-30">call_end</i></button>
                                            <button class="btn option"><i class="material-icons md-30">person_add</i></button>
                                            <button class="btn option"><i class="material-icons md-30">volume_up</i></button>
                                        </div>
                                        <button class="btn back" name="1"><i class="material-icons md-24">chat</i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- End of Call -->
            </div>
            <!-- End of Babble -->
            <!-- Start of Babble -->
            <div class="babble tab-pane fade" id="list-empty" role="tabpanel" aria-labelledby="list-empty-list">
                <!-- Start of Chat -->
                <div class="chat" id="chat2">
                    <div class="top">
                        <div class="container">
                            <div class="col-md-12">
                                <div class="inside">
                                    <a href="#"><img class="avatar-md" src="dist/img/avatars/avatar-female-2.jpg" data-toggle="tooltip" data-placement="top" title="Lean" alt="avatar"></a>
                                    <div class="status">
                                        <i class="material-icons offline">fiber_manual_record</i>
                                    </div>
                                    <div class="data">
                                        <h5><a href="#">Lean Avent</a></h5>
                                        <span>Inactive</span>
                                    </div>
                                    <button class="btn connect d-md-block d-none" name="2"><i class="material-icons md-30">phone_in_talk</i></button>
                                    <button class="btn connect d-md-block d-none" name="2"><i class="material-icons md-36">videocam</i></button>
                                    <button class="btn d-md-block d-none"><i class="material-icons md-30">info</i></button>
                                    <div class="dropdown">
                                        <button class="btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="material-icons md-30">more_vert</i></button>
                                        <div class="dropdown-menu dropdown-menu-right">
                                            <button class="dropdown-item connect" name="2"><i class="material-icons">phone_in_talk</i>Voice Call</button>
                                            <button class="dropdown-item connect" name="2"><i class="material-icons">videocam</i>Video Call</button>
                                            <hr>
                                            <button class="dropdown-item"><i class="material-icons">clear</i>Clear History</button>
                                            <button class="dropdown-item"><i class="material-icons">block</i>Block Contact</button>
                                            <button class="dropdown-item"><i class="material-icons">delete</i>Delete Contact</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="content empty">
                        <div class="container">
                            <div class="col-md-12">
                                <div class="no-messages">
                                    <i class="material-icons md-48">forum</i>
                                    <p>Seems people are shy to start the chat. Break the ice send the first message.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="container">
                        <div class="col-md-12">
                            <div class="bottom">
                                <form class="position-relative w-100">
                                    <textarea class="form-control" placeholder="Start typing for reply..." rows="1"></textarea>
                                    <button class="btn emoticons"><i class="material-icons">insert_emoticon</i></button>
                                    <button type="submit" class="btn send"><i class="material-icons">send</i></button>
                                </form>
                                <label>
                                    <input type="file">
                                    <span class="btn attach d-sm-block d-none"><i class="material-icons">attach_file</i></span>
                                </label> 
                            </div>
                        </div>
                    </div>
                </div>
                <!-- End of Chat -->
                <!-- Start of Call -->
                <div class="call" id="call2">
                    <div class="content">
                        <div class="container">
                            <div class="col-md-12">
                                <div class="inside">
                                    <div class="panel">
                                        <div class="participant">
                                            <img class="avatar-xxl" src="dist/img/avatars/avatar-female-2.jpg" alt="avatar">
                                            <span>Connecting</span>
                                        </div>							
                                        <div class="options">
                                            <button class="btn option"><i class="material-icons md-30">mic</i></button>
                                            <button class="btn option"><i class="material-icons md-30">videocam</i></button>
                                            <button class="btn option call-end"><i class="material-icons md-30">call_end</i></button>
                                            <button class="btn option"><i class="material-icons md-30">person_add</i></button>
                                            <button class="btn option"><i class="material-icons md-30">volume_up</i></button>
                                        </div>
                                        <button class="btn back" name="2"><i class="material-icons md-24">chat</i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- End of Call -->
            </div>
            <!-- End of Babble -->
            <!-- Start of Babble -->
            <div class="babble tab-pane fade" id="list-request" role="tabpanel" aria-labelledby="list-request-list">
                <!-- Start of Chat -->
                <div class="chat" id="chat3">
                    <div class="top">
                        <div class="container">
                            <div class="col-md-12">
                                <div class="inside">
                                    <a href="#"><img class="avatar-md" src="dist/img/avatars/avatar-female-6.jpg" data-toggle="tooltip" data-placement="top" title="Louis" alt="avatar"></a>
                                    <div class="status">
                                        <i class="material-icons offline">fiber_manual_record</i>
                                    </div>
                                    <div class="data">
                                        <h5><a href="#">Louis Martinez</a></h5>
                                        <span>Inactive</span>
                                    </div>
                                    <button class="btn disabled d-md-block d-none" disabled><i class="material-icons md-30">phone_in_talk</i></button>
                                    <button class="btn disabled d-md-block d-none" disabled><i class="material-icons md-36">videocam</i></button>
                                    <button class="btn d-md-block disabled d-none" disabled><i class="material-icons md-30">info</i></button>
                                    <div class="dropdown">
                                        <button class="btn disabled" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" disabled><i class="material-icons md-30">more_vert</i></button>
                                        <div class="dropdown-menu dropdown-menu-right">
                                            <button class="dropdown-item"><i class="material-icons">phone_in_talk</i>Voice Call</button>
                                            <button class="dropdown-item"><i class="material-icons">videocam</i>Video Call</button>
                                            <hr>
                                            <button class="dropdown-item"><i class="material-icons">clear</i>Clear History</button>
                                            <button class="dropdown-item"><i class="material-icons">block</i>Block Contact</button>
                                            <button class="dropdown-item"><i class="material-icons">delete</i>Delete Contact</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="content empty">
                        <div class="container">
                            <div class="col-md-12">
                                <div class="no-messages request">
                                    <a href="#"><img class="avatar-xl" src="dist/img/avatars/avatar-female-6.jpg" data-toggle="tooltip" data-placement="top" title="Louis" alt="avatar"></a>
                                    <h5>Louis Martinez would like to add you as a contact. <span>Hi Keith, I'd like to add you as a contact.</span></h5>
                                    <div class="options">
                                        <button class="btn button"><i class="material-icons">check</i></button>
                                        <button class="btn button"><i class="material-icons">close</i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="container">
                        <div class="col-md-12">
                            <div class="bottom">
                                <form class="position-relative w-100">
                                    <textarea class="form-control" placeholder="Messaging unavailable" rows="1" disabled></textarea>
                                    <button class="btn emoticons disabled" disabled><i class="material-icons">insert_emoticon</i></button>
                                    <button class="btn send disabled" disabled><i class="material-icons">send</i></button>
                                </form>
                                <label>
                                    <input type="file" disabled>
                                    <span class="btn attach disabled d-sm-block d-none"><i class="material-icons">attach_file</i></span>
                                </label> 
                            </div>
                        </div>
                    </div>
                </div>
                <!-- End of Chat -->
            </div>
            <!-- End of Babble -->
        </div>
    </div>
</template>
<script>
import { computed, watch, ref, onUnmounted, onMounted, onActivated, onDeactivated } from "vue";
import { collection, limit, onSnapshot, query, orderBy } from 'firebase/firestore';
import Message from "./Chats/Message";
import Input from "./Chats/Input";
import moment from "moment/moment";
import db from '@/utils/firebase/init';
import UserStore from "@/state/User";
export default {
    name: "Chat",
    components: {
        Message,
        Input
    },
    props: ["chatId", "profile"],
    setup({chatId}) {
        const user = UserStore();
        let snap = "";
        let chats = ref([]);

        const showFormattedDate = (date) => {
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            };
            return new Date(date).toLocaleDateString('id-ID', options);
        };
     
        const q = query(collection(db, "messages", chatId, "messages"), limit(10), orderBy("sendAt", "asc"))

        snap = onSnapshot(q, snapShot => {
            console.log(snapShot.size)
            snapShot.docChanges().forEach(snap => {
                console.log(snap.doc.data())
                if (snap.type === "added") {
                    chats.value.push({
                        id: snap.doc.id,
                        sendAt: snap.doc.data().sendAt,
                        message: snap.doc.data().message,
                        isRead: snap.doc.data().isRead,
                        uid: snap.doc.data().uid
                    })
                }
                if (snap.type === "modified") {
                    let indexModified = chats.value.findIndex(v => v.id == snap.doc.id);
                    if (indexModified != -1) {
                        chats.value.splice(indexModified, 1, {...snap.doc.data(), id: snap.doc.id, sendAt: snap.doc.data().sendAt})
                    }
                }
                if (snap.type === "removed") {
                    chats.value.splice(chats.value.findIndex(v => v.id == snap.doc.id), 1)
                }
            });
        })

        return { chats, user, moment, showFormattedDate }
    }
}
</script>