<script setup lang="ts">
import {IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonRow, IonSlides} from "@ionic/vue";
import RetroGamePostImage from "@/components/RetroGamePostImage.vue";
import {defineProps} from "vue";

interface Props {
  post: {
    id: number,
    images: {
      directus_files_id: {
        id: number
      }
    }
    title: string,
    description: string,
    plattform: string[],
    price: number,
    state: string,
    location: {
      type: string,
      coordinates: [
        lat: number,
        long: number
      ]
    }
  },
}

//Har bildne inni en slides for å kunne scrolle på bildene, hvært bilde får en ion-slide, som står i komponenten

const props = defineProps<Props>()
</script>

<template>
  <ion-card :router-link="'postDetail/' + post.id">
    <ion-slides>
      <retro-game-post-image v-for="image in post.images" :key="image.directus_files_id.id"
                             :image-id="image.directus_files_id.id"/>
    </ion-slides>
    <ion-card-header>
      <ion-row>
        <ion-col size="9">
          <ion-chip v-for="plattform in post.plattform" :key="plattform">{{ plattform }}</ion-chip>
        </ion-col>
        <ion-col size="3">
          <ion-chip style="color: orange">{{ post.state }}</ion-chip>
        </ion-col>
        <ion-col size="8">
          <ion-card-subtitle>{{ post.location.coordinates }}</ion-card-subtitle>
        </ion-col>
        <ion-col size="4">
          <ion-card-subtitle>Bilder: {{ post.images.length }}</ion-card-subtitle>
        </ion-col>

        <ion-col size="9">
          <ion-card-title>{{ post.title }}</ion-card-title>
        </ion-col>

        <ion-col size="3">
          <ion-card-title>Kr{{ post.price }}</ion-card-title>
        </ion-col>
      </ion-row>
    </ion-card-header>
  </ion-card>
</template>

<style scoped>
ion-card {
  background: linear-gradient(#000000, #242424) padding-box,
  linear-gradient(to right, red, orange) border-box;
  border-radius: 5px;
  border: 15px solid transparent;
}
ion-card-title{
  color: #ffffff;
}
</style>

