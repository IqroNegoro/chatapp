<template>
    <div class="navigation">
        <div class="container">
            <div class="inside">
                <div class="nav nav-tab menu">
                    <button class="btn">
                        <img class="avatar-xl" :src="user.photoURL || 'img/noimage.png'" referrerpolicy="no-referrer" alt="avatar">
                    </button>
                    <router-link :to="{name: 'home'}"><i class="material-icons" :class="{'active': $route.name == 'home'}">chat_bubble_outline</i></router-link>
					<router-link :to="{name: 'setting'}"><i class="material-icons" :class="{'active': $route.name == 'setting'}">settings</i></router-link>
                    <button class="btn power" @click="user.logout"><i class="material-icons">power_settings_new</i></button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import UserStore from '@/state/User'
export default {
    name: "Navigation",
    setup() {
        const user = UserStore();

        return { user }
    }
}
</script>