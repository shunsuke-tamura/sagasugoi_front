<template>
  <div id="canvas"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import p5 from "p5";
import { fishTankSetup } from "../js/FishTankSetup";

const P5 = ref();

onMounted(() => {
  P5.value = new p5(fishTankSetup);
});
</script>
