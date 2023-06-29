<template>
    <div class="fixed top-0 left-0 bg-black bg-opacity-50 w-full h-screen z-[9992]" v-if="showConfirmPassword">
        <div class="modal fade show" id="startnewchat" tabindex="-1" role="dialog" style="display: block">
            <div class="modal-dialog modal-dialog-centered mx-auto" role="document">
                <div class="requests">
                    <div class="title">
                        <h1>Please Enter Your Password</h1>
                        <button type="button" class="btn" data-dismiss="modal" aria-label="Close" @click="showConfirmPassword = false"><i class="material-icons">close</i></button>
                    </div>
                    <div class="content">
                        <form @submit.prevent="reAuthenticateUser">
                            <div class="form-group">
                                <label for="participant">Password</label>
                                <input type="password" class="form-control" id="participant" placeholder="Password" v-model="confirmPassword" required>
                            </div>
                            <button type="submit" class="btn button w-100" @submit.prevent="handleSubmit">Confirm</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="w-full py-4" id="sidebar">
        <div class="settings col-md-12">
            <div class="profile">
                <img class="avatar-xl mx-auto" :src="user.photoURL || 'img/noimage.png'" referrerpolcy="no-referrer"
                    alt="avatar">
                <h1>{{ user.displayName }}</h1>
            </div>
            <div class="categories" id="accordionSettings">
                <h1>Settings</h1>
                <!-- Start of My Account -->
                <div class="category">
                    <a href="#" class="title" id="headingOne" data-toggle="collapse" data-target="#collapseOne"
                        aria-expanded="true" aria-controls="collapseOne">
                        <i class="material-icons md-30 online">person_outline</i>
                        <div class="data">
                            <h5>My Account</h5>
                            <p>Update your profile details</p>
                        </div>
                        <i class="material-icons">keyboard_arrow_right</i>
                    </a>
                    <div class="collapse show relative" id="collapseOne" aria-labelledby="headingOne"
                        data-parent="#accordionSettings">
                        <div v-if="loading" class="w-full h-full absolute top-0 left-0 bg-black bg-opacity-25"></div>
                        <div class="content">
                            <div class="upload">
                                <div class="data">
                                    <img class="avatar-xl" :src="user.photoURL || 'img/noimage.png'"
                                        referrerpolcy="no-referrer" alt="image" ref="previewImage">
                                    <label>
                                        <input type="file" @change="handlePreviewImage">
                                        <span class="btn button">Upload avatar</span>
                                    </label>
                                </div>
                                <p>For best results, use an image at least 256px by 256px in either .jpg or
                                    .png format!</p>
                            </div>
                            <form @submit.prevent="handleSubmit">
                                <div class="parent">
                                    <div class="field">
                                        <label for="firstName">Name <span>*</span></label>
                                        <input type="text" class="form-control" id="firstName" placeholder="First name"
                                            v-model="name" required>
                                    </div>
                                </div>
                                <div class="field">
                                    <label for="email">Email <span>*</span></label>
                                    <input type="email" class="form-control" id="email"
                                        placeholder="Enter your email address" v-model="email" required>
                                </div>
                                <div class="field">
                                    <label for="password">Password</label>
                                    <input type="password" class="form-control" id="password"
                                        placeholder="Enter a new password" v-model="password">
                                </div>
                                <div class="field">
                                    <label for="location">Invite ID</label>
                                    <input type="text" class="form-control disabled" id="location"
                                        placeholder="Enter your location" v-model="inviteID" required disabled>
                                </div>
                                <p v-if="err" class="text-red-500 text-center">{{ err }}</p>
                                <button class="btn btn-link w-100">Delete Account</button>
                                <button type="submit" class="btn button w-100" @submit.prevent="handleSubmit">Apply</button>
                            </form>
                        </div>
                    </div>
                </div>
                <!-- End of My Account -->
                <div class="category">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import UserStore from '@/state/User'
import { inject, ref } from 'vue';
import { db, storage } from '@/utils/firebase/init';
import Swal from "sweetalert2";
import { collection, query, limit, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { getAuth, updateProfile, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { nanoid } from 'nanoid';
export default {
    name: "Setting",
    setup() {
        const user = UserStore();

        let name = ref(user.displayName);
        let image = ref(null);
        let previewImage = ref(null);
        let email = ref(user.email);
        let password = ref("");
        let inviteID = ref(user.inviteID);
        
        let emitter = inject("emitter");

        let loading = ref(false);
        let err = ref(null);
        let showConfirmPassword = ref(false);
        let confirmPassword = ref("");

        let auth = getAuth();
        const handleSubmit = async () => {
            try {
                let updateData = {
                    displayName: name.value,
                    email: email.value,
                }

                loading.value = true;

                if (email.value != user.email) {
                    let searchEmail = await getDocs(query(collection(db, "users"), where("email", "==", updateData.email), limit(1)))
                    if (searchEmail.size) {
                        err.value = "Email Tidak Tersedia!";
                        return;
                    }
                }

                let userDoc = doc(db, "users", user.firebaseID);

                if (updateData.email != user.email) {
                    let updateEmailUser = await updateEmail(auth.currentUser, updateData.email);
                    let updateDocEmailUser = await updateDoc(userDoc, {
                        email: updateData.email
                    })
                }

                if (password.value) {
                    let updatePasswordUser = await updatePassword(auth.currentUser, password.value);
                }

                if (updateData.displayName != user.displayName) {
                    let updatingUser = await updateProfile(auth.currentUser, {
                        displayName: updateData.displayName
                    })

                    let updatingDocNameUser = await updateDoc(userDoc, {
                        displayName: updateData.displayName
                    })
                }

                if (image.value) {
                    const profile = storageRef(storage, `profile/${nanoid()}.${image.value.type.split("/")[1]}`);

                    let uploadTask = uploadBytes(profile, image.value).then(snapshot => {
                        getDownloadURL(snapshot.ref).then(async res => {
                            await updateDoc(userDoc, {
                                photoURL: res
                            })
                        })
                    })
                }

                loading.value = false;

                if (updateData.email != user.email) {
                    Swal.fire({
                        title: "Update Success, Please Log In Again",
                        icon: "success"
                    })
                } else {
                    Swal.fire({
                        title: "Update Success",
                        icon: "success"
                    })
                }

                password.value = "";
            } catch (error) {
                if (error.code == 'auth/requires-recent-login') {
                    showConfirmPassword.value = true;
                }

                if (error.code == 'auth/weak-password') {
                    err.value = "Password Harus Lebih Dari 6 Karakter!"
                }
            }
        }

        const reAuthenticateUser = password => {
            try {
                emitter.emit("isLoading", true);
                const credential = EmailAuthProvider.credential(user.email, confirmPassword.value);
                reauthenticateWithCredential(auth.currentUser, credential).then(() => {
                    handleSubmit();
                });
                emitter.emit("isLoading", false);
            } catch (error) {
                err.value = "Something Went Wrong";
                emitter.emit("isLoading", false);
            }
        }

        const handlePreviewImage = ({target}) => {
            if (!["jpg", "png", "jpeg"].includes(target.files[0].type.split("/")[1])) {
                Swal.fire({
                    icon: "error",
                    title: "Please Upload An Image"
                })
                target.value = "";
                return;
            }
            let src = URL.createObjectURL(target.files[0]);
            image.value = target.files[0];
            previewImage.value.src = src;
        }

        return { user, name, email, inviteID, handleSubmit, password, loading, image, err, showConfirmPassword, reAuthenticateUser, confirmPassword, handlePreviewImage, previewImage }
    }
}
</script>