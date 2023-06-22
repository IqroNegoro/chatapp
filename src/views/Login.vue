<template>
    <main>
        <div class="layout">
            <!-- Start of Sign In -->
            <div class="main order-md-1">
                <div class="start">
                    <div class="container">
                        <div class="col-md-12">
                            <div class="content">
                                <h1>Sign in to Chat</h1>
                                <div class="third-party">
                                    <!-- <button class="border-0 cursor-pointer hover:bg-blue-400 pt-1 px-2 rounded-sm text-black text-2xl hover:text-white" @click="popupSignIn">
                                        <i class='bx bxl-google'></i>                             
                                    </button> -->
                                </div>
                                <p>or use your email account:</p>
                                <form @submit.prevent="signInWithEmail">
                                    <div class="form-group">
                                        <input type="email" id="inputEmail" class="form-control" placeholder="Email Address" required v-model="email">
                                        <button class="btn icon"><i class="material-icons">mail_outline</i></button>
                                    </div>
                                    <div class="form-group">
                                        <input type="password" id="inputPassword" class="form-control" placeholder="Password" required v-model="password">
                                        <button class="btn icon"><i class="material-icons">lock_outline</i></button>
                                    </div>
                                    <p class="text-red-500" v-if="error" @click="e => e.target.classList.add('hidden')">{{ error }}</p>
                                    <button type="submit" class="btn button" @click="signInWithEmail">Sign In</button>
                                    <div class="callout">
                                        <span>Don't have account? <router-link :to="{name: 'register'}">Create Account</router-link></span>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- End of Sign In -->
            <!-- Start of Sidebar -->
            <div class="aside order-md-2">
                <div class="container">
                    <div class="col-md-12">
                        <div class="preference">
                            <h2>Hello, Friend!</h2>
                            <p>Enter your personal details and start your journey with Swipe today.</p>
                            <router-link :to="{name: 'register'}" class="btn button">Sign Up</router-link>
                        </div>
                    </div>
                </div>
            </div>
            <!-- End of Sidebar -->
        </div> <!-- Layout -->
    </main>
</template>
<script>
import db from "@/utils/firebase/init";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { query, limit, where, collection, getDocs } from "firebase/firestore";
import UserStore from "@/state/User";
import router from "@/router";
import { inject, ref } from "vue";

export default {
    name: "Login",
    setup() {
        let userState = UserStore();
        let emitter = inject("emitter");
        
        let email = ref("iqronegoro0@gmail.com");
        let password = ref("proevening11");
        let error = ref(null);
        
        const signInWithEmail = () => {
            emitter.emit("isLoading", true); 
            let auth = getAuth();
            signInWithEmailAndPassword(auth, email.value, password.value).then(async res => {
                // const credential = GoogleAuthProvider.credentialFromResult(res);
                // const token = credential.accessToken;
                const q = query(collection(db, "users"), where("email", "==", email.value), limit(1));
        
                const doc = await getDocs(q);

                doc.forEach(v => userState.$patch({
                    firebaseID: v.id,
                    displayName: v.data().displayName,
                    email: v.data().email,
                    photoURL: v.data().photoURL,
                    uid: v.data().uid,
                    chats: v.data().chats,
                    authenticated: true
                }))
                
                router.push({name: "home"});
                emitter.emit("isLoading", false);
            }).catch(err => {
                emitter.emit("isLoading", false);
                if (err.code == 'auth/wrong-password') {
                    error.value = "Email Or Password Wrong!";
                    return;
                }

                if (err.code == 'auth/user-not-found') {
                    error.value = "Account Doesnt Exists!";
                    return;
                }

                error.value = "Something Went Wrong";
            });
        }

        return { signInWithEmail, email, password, error }
    }
}

</script>