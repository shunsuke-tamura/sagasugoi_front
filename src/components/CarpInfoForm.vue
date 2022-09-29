<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" dark v-bind="attrs" v-on="on"> Open Dialog </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">"さがす鯉"作成</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field v-model="word" label="単語*" required></v-text-field>
          <!-- <v-text-field v-model="comment" label="説明" required></v-text-field> -->
          <v-textarea
            v-model="comment"
            solo
            label="説明*"
            required
          ></v-textarea>
          <v-text-field v-model="url" label="参考URL"></v-text-field>
        </v-form>
        <v-card-actions>
          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="doSubmit"
          >
            作成
          </v-btn>
          <v-btn color="error" class="mr-4" @click="doCancel">
            キャンセル
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axiosClient from "../lib/axios";

const word = ref<string | undefined>(undefined);
const comment = ref<string | undefined>(undefined);
const url = ref<string | undefined>(undefined);
const dialog = ref<boolean>(false);
const valid = ref<boolean>(false);

const closeDialog = () => {
  dialog.value = false;
};

const doCancel = () => {
  closeDialog();
};

const doSubmit = async () => {
  const data = {
    word: word.value,
    comment: comment.value,
    url: url.value,
    typeId: "1",
  };
  const res = await axiosClient().post("/carps", data);
  console.log(res.data);
  closeDialog();
};
</script>
