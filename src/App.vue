<template>
  <div>
    <Loading v-if="isLoading" />
    <router-view/>
  </div>
</template>
<script setup>
import Loading from "@/components/Loading";
import { inject, ref } from "vue";

let emitter = inject("emitter");
let isLoading = ref(false)

emitter.on("isLoading", val => isLoading.value = val);
</script>