<template>
    <div class="container">
        <div class="col-md-12">
            <div class="bottom">
                <form class="position-relative w-100" @submit.prevent="handleSubmit">
                    <textarea class="text-black form-control whitespace-normal" style="color: black"
                        placeholder="Start typing for reply..." rows="1" v-model="message"></textarea>
                    <button type="submit" class="btn send" @click.prevent="handleSubmit"><i
                            class="material-icons">send</i></button>
                </form>
                <label>
                    <input type="file" @change="handleUploadFile">
                    <span class="btn attach d-sm-block"><i class="material-icons">attach_file</i></span>
                </label>
            </div>
        </div>
    </div>
</template>
<script>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { db, storage } from "@/utils/firebase/init";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import UserStore from '@/state/User';
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { nanoid } from 'nanoid';

export default {
    name: "Input",
    props: ["messageId"],
    setup({ messageId }, { emit }) {
        const user = UserStore();
        let message = ref("");
        let id = computed(() => messageId);

        const handleSubmit = async () => {
            try {
                if (message.value) {
                const docs = await addDoc(collection(db, "messages", messageId, "messages"), {
                    sendAt: +new Date(),
                    message: message.value,
                    isRead: false,
                    uid: user.uid,
                    type: "text"
                })

                const updateLastMessage = await updateDoc(doc(db, "chats", messageId), {
                    lastMessageAt: +new Date(),
                    lastMessage: message.value
                });
                message.value = "";
                emit("down")
            }
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Something Went Wrong",
                    timer: 3000
                })
            }
        }

        const handleUploadFile = ({ target }) => {
            try {
                let pathImage = `${nanoid()}.${target.files[0].type.split("/")[1]}`
                const storageFolder = storageRef(storage, `image/${pathImage}`);

                let uploadTask = uploadBytes(storageFolder, target.files[0]).then(snapshot => {
                    getDownloadURL(snapshot.ref).then(async res => {
                        await addDoc(collection(db, "messages", messageId, "messages"), {
                            sendAt: +new Date(),
                            isRead: false,
                            uid: user.uid,
                            type: "image",
                            url: res,
                            pathImage
                        })

                        const updateLastMessage = await updateDoc(doc(db, "chats", messageId), {
                            lastMessageAt: +new Date(),
                            lastMessage: "Image"
                        });
                    })
                })
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Something Went Wrong",
                    timer: 3000
                })
            }
        }

        const handleEnter = e => {
            if (e.code == 'Enter') {
                handleSubmit();
            }
        }

        onMounted(() => {
            document.addEventListener("keydown", handleEnter)
        })

        onUnmounted(() => {
            document.removeEventListener("keydown", handleEnter)
        })

        return { message, handleSubmit, id, handleUploadFile }
    }
}
</script>