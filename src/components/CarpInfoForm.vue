<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" dark v-bind="attrs" v-on="on"> 鯉を作成 </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">"さがす鯉"作成</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field v-model="word" label="単語*" required></v-text-field>
          <v-textarea
            v-model="comment"
            solo
            label="説明*"
            required
          ></v-textarea>
          <v-text-field v-model="url" label="参考URL"></v-text-field>
          <v-file-input
            v-model="image"
            accept="image/*"
            label="画像"
            prepend-icon="mdi-camera"
          ></v-file-input>
          <v-img
            v-if="imageUrl"
            contain
            :src="imageUrl"
            max-width="500"
            max-height="300"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-1"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
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
import { ref, defineEmits, watch } from "vue";
import axiosClient from "../lib/axios";
import getRandomIntNum from "@/lib/GetRandomIntNum";
import { v4 as uuidv4 } from "uuid";
import { SASToken } from "@/types/SASToken";
import { BlockBlobClient, AnonymousCredential } from "@azure/storage-blob";

const word = ref<string | undefined>(undefined);
const comment = ref<string | undefined>(undefined);
const url = ref<string | undefined>(undefined);
const image = ref<File | undefined>(undefined);
const imageUrl = ref<string | undefined>(undefined);
const dialog = ref<boolean>(false);
const valid = ref<boolean>(false);

watch(image, (nextVal) => {
  imageUrl.value = nextVal && URL.createObjectURL(nextVal);
});

const closeDialog = () => {
  dialog.value = false;
};

const doCancel = () => {
  closeDialog();
};

const getSASUrl = async (
  targetFlielExtension: string
): Promise<[string | undefined, string | undefined]> => {
  const res = await axiosClient().get("/sas_token");
  if (res.status != 200) {
    console.error("cannot get SAS Token");
    return [undefined, undefined];
  }
  const sasToken: SASToken = res.data;
  const fileName = uuidv4();
  return [
    `${sasToken.url}/image/${fileName}.${targetFlielExtension}?${sasToken.sasKey}`,
    `${fileName}.${targetFlielExtension}`,
  ];
};

const uploadImage = async (targetFile: File): Promise<string | undefined> => {
  const extension = targetFile.name.split(".").pop();
  if (!extension) {
    console.error("cannot extract extention");
    return undefined;
  }
  const [sasUrl, fileName] = await getSASUrl(extension);
  if (!sasUrl) {
    return undefined;
  }
  const blockBlobClient = new BlockBlobClient(sasUrl);
  blockBlobClient.uploadData(targetFile);
  return fileName;
};

const emit = defineEmits(["addCarp"]);
const doSubmit = async () => {
  const imageName = image.value ? await uploadImage(image.value) : undefined;
  const r = getRandomIntNum(0, 256);
  const g = getRandomIntNum(0, 256);
  const b = getRandomIntNum(0, 256);
  const data = {
    word: word.value,
    comment: comment.value,
    url: url.value,
    r: r,
    g: g,
    b: b,
    imageName: imageName,
  };
  console.log(data);
  const res = await axiosClient().post("/carps/", data);
  console.log(res.data);
  closeDialog();
  emit("addCarp", res.data);
};
</script>
