<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonCardContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonLabel,
    IonButtons,
    IonButton,
    IonProgressBar,
  onIonViewDidEnter
} from '@ionic/vue';
import {
  addCircleOutline,
  chevronDownCircleOutline,
  settings,
  logIn, logOut,
} from "ionicons/icons";
import {personCircleOutline, mapOutline} from "ionicons/icons";
import {ref} from 'vue';
import RetroGamePostCard from "@/components/RetroGamePostCard.vue";
import {authService, directus} from "@/services/directus.service";
import IRetroGamePosts from "@/Interface/IRetroGamePosts"
import router from "@/router";

const userAccessToken = localStorage.getItem('auth_token');

const retroGamePosts = ref<IRetroGamePosts>([]);

onIonViewDidEnter(async () => {
  await fetchRetroGamePosts();
})

const loggOff = () => {
  authService.logout()
  router.replace('/auth');
}

const fetchRetroGamePosts = async () => {
  const response = await directus.graphql.items<IRetroGamePosts>(`
  query MyQuery {
  retroGames_posts {
    id
    title
    description
    images {
      directus_files_id {
        id
      }
    }
    location
  }
}
`)

  if (response.status === 200 && response.data) {
    retroGamePosts.value = [...response.data.retroGames_posts];
  }
}

const doRefresh = (event: CustomEvent) => {
  fetchRetroGamePosts();
  event.target.complete();
}

</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>NostalgiGames 🕹</ion-title>
        <ion-buttons slot="primary">
          <ion-button v-if="userAccessToken" router-link="/userPage">
            <ion-icon slot="icon-only" :icon="personCircleOutline"/>
          </ion-button>
          <ion-button router-link="/postsMap">
            <ion-icon slot="icon-only" :icon="mapOutline"/>
          </ion-button>
        </ion-buttons>
        <ion-progress-bar v-if="retroGamePosts.length <= 0" :buffer="0.001"></ion-progress-bar>

      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" pull-factor="0.8" pull-min="100" pull-max="200" @ionRefresh="doRefresh($event)">
        <ion-refresher-content :pulling-icon="chevronDownCircleOutline"
                               pulling-text="Pull to refresh"
                               refreshing-spinner="circles"
                               refreshing-text="Refreshing..."></ion-refresher-content>
      </ion-refresher>
      <ion-card>
        <ion-card-content>
          <p>Velkommen til Nostalgia Shop! Her kan du se på annonser som er lagt ut! Om du ønsker å legge ut
            ditt eget annonse, eller kontakte selgeren, så må du registrere deg og logge inn. </p>
        </ion-card-content>
      </ion-card>

      <retro-game-post-card v-for="post in retroGamePosts" :key="post.id" :post="post"/>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button>
          <ion-icon :icon="settings"></ion-icon>
        </ion-fab-button>
        <ion-fab-list v-if="!userAccessToken" side="top">
          <ion-fab-button router-link="/auth">
            <ion-icon :icon="logIn"></ion-icon>
          </ion-fab-button>
          <ion-label>Logg in</ion-label>
        </ion-fab-list>
        <ion-fab-list v-else side="top">
          <ion-fab-button>
            <ion-icon @click="loggOff" :icon="logOut"></ion-icon>
          </ion-fab-button>
          <ion-label>Logg ut</ion-label>
        </ion-fab-list>
        <ion-fab-list v-if="userAccessToken" side="start">
          <ion-fab-button router-link="/newPost">
            <ion-icon :icon="addCircleOutline"></ion-icon>
          </ion-fab-button>
          <ion-label>Legg ut et nytt post</ion-label>
        </ion-fab-list>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>


<style scoped>

p {
  font-weight: bold;
}

ion-label {
  font-size: 12px;
  margin: auto;
  white-space: nowrap;
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  line-height: 24px;
  padding: 4px 4px;
  border-radius: 4px;
}

ion-progress-bar{
  --background: #52ffe4;
}
</style>
