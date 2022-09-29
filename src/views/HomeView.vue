<template>
  <div class="main-container">
    <v-row justify="center">
      <fish-tank></fish-tank>
    </v-row>
    <v-row justify="end">
      <div class="info-form">
        <carp-info-form />
      </div>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CarpInfoForm from "../components/CarpInfoForm.vue";
import FishTank from "../components/FishTank.vue";

export default Vue.extend({
  name: "HomeView",

  components: {
    CarpInfoForm,
    FishTank,
  },
});
</script>

<style>
.main-container {
  padding: 30px;
}

.info-form {
  margin-right: 30px;
}
</style>
