<template>
  <div>
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          Open Dialog
        </v-btn>
      </template>
      <v-card>
        <div>ワード：{{ incrementNum }}</div>
        <v-text-field v-model="word" label="word" required></v-text-field>
        <div>コメント</div>
        <v-text-field v-model="comment" label="comment" required></v-text-field>
        <div>参考URL</div>
        <v-text-field v-model="url" label="URL" required></v-text-field>
        <v-btn depressed color="primary" @click="doCancel"> キャンセル </v-btn>
        <v-row justify="center">
          <v-btn depressed color="primary" @click="doIncrement"> 作成 </v-btn>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const incrementNum = ref<number>(0);
const word = ref<string>("");
const comment = ref<string>("");
const url = ref<string>("");
const dialog = ref<boolean>(false);

watch(dialog, (afterVal) => {
  console.log(afterVal);
});

const doCancel = () => {
  console.log("cancel");
  closeDialog();
};

const closeDialog = () => {
  dialog.value = false;
};

const doIncrement = () => {
  parse();
  incrementNum.value += 1;
  closeDialog();
};

const parse = () => {
  var obj = {
    id: incrementNum.value,
    word: word.value,
    comment: comment.value,
    url: url.value,
  };
  var json = JSON.stringify(obj);
  console.log(json);
};
</script>
