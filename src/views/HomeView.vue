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
        <carp-info
          :word="word"
          :comment="comment"
          :url="url"
          :show="showDetail"
          @close="closeDialog"
        />
      </div>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import CarpInfoForm from "../components/CarpInfoForm.vue";
import CarpInfo from "@/components/CarpInfo.vue";
import FishTank from "../components/FishTank.vue";

import { ref } from "vue";
import axiosClient from "@/lib/axios";

const word = ref<string>("");
const comment = ref<string>("");
const url = ref<string | undefined>("");
const showDetail = ref<boolean>(false);

type Carp = {
  word: string;
  comment: string;
  url: string | undefined;
};

const showCarpDetail = (data: Carp) => {
  word.value = data.word;
  comment.value = data.comment;
  url.value = data.url;
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

const add = (newCarp) => {
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
