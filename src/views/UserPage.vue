<script setup lang="ts">
import {authService, directus} from "@/services/directus.service";
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
  IonButton,
  onIonViewDidEnter, actionSheetController
} from "@ionic/vue";
import {defineProps, ref} from "vue";
import {useRouter} from "vue-router";

const currentUser = ref({});
const router = useRouter();

onIonViewDidEnter(async () => {
  currentUser.value = await authService.currentUser();
})

const deleteCurrentUser = async () => {
  await directus.users.deleteOne(currentUser.value.id);
  localStorage.removeItem('auth_token');
  await router.replace('/');
}

//må legge til input felter!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const updateCurrentUser = async () => {
  await directus.users.updateOne(currentUser.value.id, {
    first_name: "forrr",
    email: "das@mail.com"
  })
}

const presentActionSheet = async () => {
  const actionSheet = await actionSheetController.create({
    header: 'Brukeren din og all innhold blir slettet permanent',
    buttons: [
      {
        text: 'Slett',
        role: 'destructive',
        data: {
          action: 'delete',
        },
      },
      {
        text: 'Avbryt',
        role: 'cancel',
        data: {
          action: 'cancel',
        },
      },
    ],
  });

  await actionSheet.present();

  const res = await actionSheet.onDidDismiss();
  if (res.data.action == "delete") {
    await deleteCurrentUser();
  }
};
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button router-link="/"></ion-back-button>
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
      <ion-buttons class="profilePageBtns">
        <ion-button @click="updateCurrentUser" fill="solid" color="dark" size="default">
          Endre bruker
        </ion-button>

        <ion-button @click="presentActionSheet" fill="solid" color="dark" size="default">
          Slett bruker 😢
        </ion-button>
      </ion-buttons>
    </ion-content>
  </ion-page>

</template>

<style scoped>
ion-avatar {
  width: 100%;
  height: 50%;
}

.profilePageBtns {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>