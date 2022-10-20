<template>
  <div>
    <div id="canvas"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs, defineEmits, defineProps, watch } from "vue";
import p5 from "p5";
import { fishTankSetup, addCarps, clickedCarpData } from "../ts/FishTankSetup";
import { Carp } from "@/types/Carp";

interface Props {
  carps: Carp[];
}

const props = defineProps<Props>();
const emit = defineEmits(["clickedCarp"]);

let P5 = ref<p5>();
const { carps } = toRefs(props);

onMounted(() => {
  P5.value = new p5(fishTankSetup);
});

const add = (carps: Carp[]) => {
  P5.value && addCarps(P5.value, carps);
};

watch(carps, (afterCarps, beforeCarps) => {
  add(afterCarps.filter((i) => beforeCarps.indexOf(i) === -1));
});

watch(
  clickedCarpData,
  (afterVal) => {
    afterVal && clickedCarp(afterVal);
  },
  { deep: true }
);

const clickedCarp = (data: Carp) => {
  emit("clickedCarp", data);
};
</script>
