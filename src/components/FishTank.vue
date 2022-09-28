<template>
  <div>
    <div id="canvas"></div>
    <v-btn @click="add" color="primary">鯉ンクリメント</v-btn>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import p5 from "p5";
import { fishTankSetup, addCarps } from "../js/FishTankSetup";

const P5 = ref();

onMounted(() => {
  P5.value = new p5(fishTankSetup);
});

const add = () => {
  addCarps(P5.value, [1]);
};
</script>
