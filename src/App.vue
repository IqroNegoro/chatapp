<template>
  <main>
    <div :class="{'layout': hideElement}">
      <Navigation v-if="hideElement" />
      <Loading v-if="isLoading" />
      <router-view />
    </div>
  </main>
</template>
<script setup>
import Loading from "@/components/Loading";

import Navigation from "@/components/Sidebar/Navigation";
import { computed, inject, ref } from "vue"; 
import { useRoute } from "vue-router";


let emitter = inject("emitter")
let hideElement = computed(() => useRoute().name != 'login' && useRoute().name != 'register');;;
let isLoading = ref(false)

emitter.on("isLoading", val => isLoading.value = val);
</script>