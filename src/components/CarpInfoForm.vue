<template>
  <div>
    <div>ワード：{{ incrementNum }}</div>
    <div>コメント</div>
    <div>URL</div>
    <v-btn depressed color="primary" @click="doIncrement"> クリック+1 </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const incrementNum = ref<number>(0);

const doIncrement = () => {
  incrementNum.value += 1;
};
</script>
