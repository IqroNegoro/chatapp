<template>
    <main>
        <div class="layout">
            <!-- Start of Sign Up -->
            <div class="main order-md-2">
                <div class="start">
                    <div class="container">
                        <div class="col-md-12">
                            <div class="content">
                                <h1>Create Account</h1>
                                <div class="third-party">
                                </div>
                                <form class="signup" @submit.prevent="handleSignUp">
                                    <div class="form-parent">
                                        <div class="form-group">
                                            <input type="text" id="inputName" class="form-control" placeholder="Full Name" required v-model="fullName">
                                            <button class="btn icon"><i class="material-icons">person_outline</i></button>
                                        </div>
                                        <div class="form-group">
                                            <input type="email" id="inputEmail" class="form-control" placeholder="Email Address" required v-model="email">
                                            <button class="btn icon"><i class="material-icons">mail_outline</i></button>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <input type="password" id="inputPassword" class="form-control" placeholder="Password" required v-model="password">
                                        <button class="btn icon"><i class="material-icons">lock_outline</i></button>
                                    </div>
                                    <p class="text-red-500" v-if="error" @click="e => e.target.classList.add('hidden')">{{ error }}</p>
                                    <button type="submit" class="btn button" @click.prevent="handleSignUp">Sign Up</button>
                                    <div class="callout">
                                        <span>Already a member? <router-link :to="{name: 'login'}">Sign In</router-link></span>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- End of Sign Up -->
            <!-- Start of Sidebar -->
            <div class="aside order-md-1">
                <div class="container">
                    <div class="col-md-12">
                        <div class="preference">
                            <h2>Welcome Back!</h2>
                            <p>To keep connected with your friends please login with your personal info.</p>
                            <router-link :to="{name: 'login'}" class="btn button">Sign In</router-link>
                        </div>
                    </div>
                </div>
            </div>
            <!-- End of Sidebar -->
        </div> <!-- Layout -->
    </main>
</template>
<script setup>
import { ref, inject } from "vue"
import { getDocs, limit, where, query, collection, addDoc } from "firebase/firestore";
import { db } from "@/utils/firebase/init";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import Swal from "sweetalert2";
import router from "@/router";
import { customAlphabet } from "nanoid";

let emitter = inject("emitter");

let fullName = ref("");
let email = ref("");
let password = ref("");

let error = ref(null);
let nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz123456789", 10)

const handleSignUp = async () => {
    emitter.emit("isLoading", true);
    let auth = getAuth();
    const q = query(collection(db, "users"), where("email", "==", email.value), limit(1));

    const doc = await getDocs(q);

    if (doc.empty) {
        createUserWithEmailAndPassword(auth, email.value, password.value).then(async res => {
            const docRef = await addDoc(collection(db, "users"), {
                    displayName: fullName.value,
                    email: email.value,
                    photoURL: res.user.photoURL || 'img/noimage.png',
                    photoURL: "",
                    uid: res.user.uid,
                    chats: ["empty"],
                    inviteID: nanoid()
                })

                Swal.fire({
                        icon: 'success',
                        title: 'Signed up successfully',
                        timer: 3000
                });

                router.push({name: 'login'});
                emitter.emit("isLoading", false);
            }).catch(err => {
                if (err.code == 'auth/email-already-in-use') {
                    error.value = "Email Tidak Tersedia!"
                }
                emitter.emit("isLoading", false);
            })
    } else {
        error.value = "Email Tidak Tersedia!"
    }
}

</script>