<script setup lang="ts">
/* eslint-disable no-undef */
import {useRoute} from "vue-router";
import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonChip,
    IonSlides,
  IonAvatar, IonText, IonItem, IonListHeader, IonLabel, IonList, IonSpinner, IonTextarea,
  IonModal, onIonViewDidEnter
} from "@ionic/vue";

import {chatboxOutline} from 'ionicons/icons';
import {ref} from "vue";
import {Geolocation} from '@capacitor/geolocation';
import {directus} from "@/services/directus.service";
import CampingSpotImage from "@/components/CampingSpotImage.vue"
import RetroGamePostImage from "@/components/RetroGamePostImage.vue";

const route = useRoute();
const {id} = route.params;

const isModalOpen = ref(false);
const newCommentText = ref('')

const retroGamePost = ref({});
const comments = ref([])


const loadPost = async () => {
  const response = await directus.graphql.items<IRetroGamePost>(`
query MyQuery {
  retroGames_posts_by_id(id: ${id}) {
    title
    description
    images {
      id
      directus_files_id {
        id
      }
    }
    location
  }
}
`);
  const responseData = response.data

  if (response.status === 200 && responseData) {
    retroGamePost.value = responseData.retroGames_posts_by_id;
    //comments.value = responseData.
  }
}


onIonViewDidEnter(async () => {
  await loadPost()
})

const addNewComment = async () => {
  if (newCommentText.value) {
    try {
      await directus.items('').createOne({
        comment: newCommentText.value,
        campSpot_fk: id,
      })
    } catch (e) {
      console.error(e)
    }
  }

  newCommentText.value = "";
  isModalOpen.value = false;
  await loadPost();
}
</script>

<template>
  <ion-page>
    <ion-header v-if="!retroGamePost.images" :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button deafult-href="/"></ion-back-button>
        </ion-buttons>
        <ion-spinner style="margin-left: 30px" name="circular"></ion-spinner>
      </ion-toolbar>
    </ion-header>

    <ion-header v-else :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button deafult-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ retroGamePost.title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="isModalOpen = true">
            <ion-icon :icon="chatboxOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content v-if="retroGamePost.images" :fullscreen="true">
      <ion-slides>
        <retro-game-post-image  v-for="image in retroGamePost.images" :key="image.directus_files_id.id" :image-id="image.directus_files_id.id"/>
      </ion-slides>

      <ion-card>
        <ion-card-title>{{ retroGamePost.title }}</ion-card-title>
        <ion-card-content>
          {{ retroGamePost.description }}
        </ion-card-content>
      </ion-card>
<!--
      <ion-card>
        <ion-list>
          <ion-list-header>
            <ion-label>
              Er du en hater eller en lover? Vis deg frem 😈
              <ion-icon :icon="chatboxOutline"></ion-icon>
            </ion-label>
          </ion-list-header>
          <ion-item v-for="comment in comments" :key="comment.id" lines="none">
            <ion-avatar slot="start">
              <camping-spot-image v-if="!comment.user_created.avatar" :image-id="campingSpot.image.id"/>
              <camping-spot-image v-else :image-id="comment.user_created.avatar.id"/>
            </ion-avatar>
            <ion-label class="ion-text-wrap">
              <ion-header>
                <b>{{ comment.user_created.first_name }}</b>
              </ion-header>
              <ion-text>
                <b>{{ comment.comment }}</b>
              </ion-text>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-card>
-->
      <ion-modal
          :is-open="isModalOpen"
          :initial-breakpoint="0.25"
          :breakpoints="[0, 0.25, 0.5, 0.75]"
          @did-dismiss="isModalOpen = false">
        <ion-content>
          <ion-item lines="none">
            <ion-label position="floating">Ny hate eller love?</ion-label>
            <ion-textarea v-model="newCommentText"></ion-textarea>
            <ion-button @click="addNewComment"></ion-button>
          </ion-item>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>

</template>