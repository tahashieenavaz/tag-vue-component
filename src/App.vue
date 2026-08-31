<script setup>
import { ref } from "vue";
import TagInput from "./components/TagInput.vue";

const tags = ref(["JavaScript", "Vue.js"]);
</script>

<template>
  <main>
    <TagInput v-model="tags" />
  </main>
</template>
