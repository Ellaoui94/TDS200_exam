<script setup lang="ts">
import {defineProps} from "vue";
import {IonCol} from "@ionic/vue";

interface Props{
  imageSrc: string
}

const props = defineProps<Props>();

//Hvert bilde får en col for å kunne vise bildene i en grid
</script>

<template>
  <ion-col>
    <img :src="`${imageSrc}`" alt="newImg"/>
  </ion-col>
</template>
