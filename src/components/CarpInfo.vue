<template>
  <v-dialog v-model="show" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">詳細情報</span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="carp.word" label="単語*" readonly></v-text-field>
        <v-textarea
          v-model="carp.comment"
          solo
          label="説明*"
          readonly
        ></v-textarea>
        <v-text-field
          v-model="carp.url"
          label="参考URL"
          readonly
        ></v-text-field>
        <v-img
          v-if="carp.imageName"
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
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="mr-4" @click="close"> 閉じる </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { Carp } from "@/types/Carp";
import { defineProps, defineEmits, toRefs, ref, watch } from "vue";
import { getImageBlobUrl } from "@/lib/sas_token";

type CarpInfoProps = {
  show: boolean;
  carp: Carp;
};

const props = defineProps<CarpInfoProps>();
const { carp, show } = toRefs(props);

const imageUrl = ref<string | undefined>(undefined);

watch(carp, async (nextVal) => {
  imageUrl.value =
    nextVal.imageName && (await getImageBlobUrl(nextVal.imageName));
});

const emit = defineEmits(["close"]);
const close = () => {
  emit("close");
};
</script>
