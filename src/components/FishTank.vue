<template>
  <div>
    <div id="canvas"></div>
    <v-btn @click="add" color="primary">鯉ンクリメント</v-btn>
    <v-btn @click="clickedCarp" color="primary">鯉クリック</v-btn>
  </div>
</template>

<script setup>
import { onMounted, ref, toRefs, defineEmits, defineProps, watch } from "vue";
import p5 from "p5";
import { fishTankSetup, addCarps } from "../js/FishTankSetup";

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

watch(carps, (afterCarps) => {
  console.log(afterCarps);
  add(afterCarps);
});

const clickedCarp = () => {
  emit("clickedCarp", {
    word: "hogehoge",
    comment: "huhuhuhhugagagagagaerere",
    url: "hhhtttttkkk",
  });
};
</script>
