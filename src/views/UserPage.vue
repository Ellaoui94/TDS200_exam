<script setup lang="ts">
import {authService} from "@/services/directus.service";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonContent,
  IonAvatar,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  onIonViewDidEnter
} from "@ionic/vue";
import {ref} from "vue";

const currentUser = ref({});

onIonViewDidEnter(async () => {
  currentUser.value = await authService.currentUser();
})
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button deafult-href="/"></ion-back-button>
        </ion-buttons>
        <ion-spinner v-if="!currentUser.avatar" style="margin-left: 30px" name="circular"></ion-spinner>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-avatar>
        <img :src="`https://7qp4jl4l.directus.app/assets/${currentUser.avatar}`"/>
      </ion-avatar>
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ currentUser.first_name }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-card-subtitle>{{ currentUser.email }}</ion-card-subtitle>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>

</template>

<style scoped>
ion-avatar {
  width: 100%;
  height: 50%;
}
</style>