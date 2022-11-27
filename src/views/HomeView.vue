<template>
  <div class="main-container">
    <v-row justify="center">
      <fish-tank :carps="carps" @clickedCarp="showCarpDetail"></fish-tank>
    </v-row>
    <v-row justify="end">
      <div class="info-form">
        <carp-info-form @addCarp="add" />
      </div>
    </v-row>
    <v-row justify="end">
      <div class="info-form">
        <carp-info :carp="carpData" :show="showDetail" @close="closeDialog" />
      </div>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import CarpInfoForm from "../components/CarpInfoForm.vue";
import CarpInfo from "@/components/CarpInfo.vue";
import FishTank from "../components/FishTank.vue";
import { Carp } from "@/types/Carp";

import { ref } from "vue";
import axiosClient from "@/lib/axios";

const carpData = ref<Carp>({
  word: "",
  comment: "",
  url: undefined,
  r: 0,
  g: 0,
  b: 0,
  imageName: undefined,
});
const showDetail = ref<boolean>(false);

const showCarpDetail = (data: Carp) => {
  carpData.value = data;
  showDetail.value = true;
};

const closeDialog = () => {
  showDetail.value = false;
};

const carps = ref<Carp[]>([]);
axiosClient()
  .get("/carps/")
  .then((res) => {
    carps.value = res.data;
    console.log(carps.value);
  });

const add = (newCarp: Carp) => {
  carps.value = [...carps.value, newCarp];
};
</script>

<style>
.main-container {
  padding: 30px;
}

.info-form {
  margin-right: 30px;
}
</style>
