<script setup lang="ts">
import {IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonSlides} from "@ionic/vue";
import RetroGamePostImage from "@/components/RetroGamePostImage.vue";
import {defineProps} from "vue";

interface Props {
  post: {
    id: number,
    title: string,
    description: string,
    images: {
      directus_files_id: {
        id: number
      }
    }
    location: {
      type: string,
      coordinates: [
        lat: number,
        long: number
      ]
    }
  },
}

const props = defineProps<Props>()
</script>

<template>
  <ion-card :router-link="'postDetail/' + post.id">
    <ion-slides>
    <retro-game-post-image v-for="image in post.images" :key="image.directus_files_id.id" :image-id="image.directus_files_id.id"/>
    </ion-slides>
      <ion-card-header>
      <ion-card-subtitle>{{post.location.coordinates}}</ion-card-subtitle>
      <ion-card-title>
        {{ post.title }}
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      {{post.description}}
    </ion-card-content>
  </ion-card>
</template>

<style scoped>
ion-card{
  border: 5px solid;
  border-radius: 5px;
}
</style>

