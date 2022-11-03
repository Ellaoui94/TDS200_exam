<script setup lang="ts">
import {defineProps} from "vue";
import {IonCol} from "@ionic/vue";

interface Props{
  imageSrc: string
}

const props = defineProps<Props>();

</script>

<template>
  <ion-col>
    <img :src="`${imageSrc}`"/>
  </ion-col>
</template>

<style scoped>
ion-slide{
  height: 300px;
}
</style>
