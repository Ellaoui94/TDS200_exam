<script setup lang="ts">
import {defineProps} from "vue";
import {IonSlide} from "@ionic/vue";

interface Props{
  imageId: string
}

const props = defineProps<Props>();

</script>

<template>
  <ion-slide>
  <img :src="`https://7qp4jl4l.directus.app/assets/${imageId}`"/>
  </ion-slide>
</template>

<style scoped>
ion-slide{
  height: 300px;
}
</style>
