import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from "pinia";
import mitt from 'mitt';

import "@/assets/css/styles.css";
import "@/dist/css/lib/bootstrap.min.css";
import "@/dist/css/swipe.min.css";
import 'sweetalert2/dist/sweetalert2.min.css';
import "@/dist/js/bootstrap.min.js";
import "@/dist/js/jquery-3.3.1.slim.min.js";
import "@/dist/js/vendor/popper.min.js";
import "@/dist/js/vendor/jquery-slim.min.js";

let emitter = mitt();
let app = createApp(App);

app.provide("emitter", emitter);

app.use(router);
app.use(createPinia())
app.mount('#app')
