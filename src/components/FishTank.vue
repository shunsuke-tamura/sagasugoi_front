<template>
  <div>
    <div id="canvas"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, toRefs, defineEmits, defineProps, watch } from "vue";
import p5 from "p5";
import { fishTankSetup, addCarps, clickedCarpData } from "../js/FishTankSetup";

const emit = defineEmits(["clickedCarp"]);

const P5 = ref();
const props = defineProps(["carps"]);
const { carps } = toRefs(props);

onMounted(() => {
  P5.value = new p5(fishTankSetup);
});

const add = (carps) => {
  addCarps(P5.value, carps);
};

watch(carps, (afterCarps, beforeCarps) => {
  add(afterCarps.filter((i) => beforeCarps.indexOf(i) === -1));
});

watch(
  clickedCarpData,
  (afterVal) => {
    clickedCarp(afterVal);
  },
  { deep: true }
);

const clickedCarp = (data) => {
  emit("clickedCarp", data);
};
</script>
