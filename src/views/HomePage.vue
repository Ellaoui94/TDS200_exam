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
  IonLabel, onIonViewDidEnter
} from '@ionic/vue';
import {
  addCircleOutline,
  chevronDownCircleOutline,
  settings,
  logIn, logOut,
} from "ionicons/icons";
import {ref} from 'vue';
import RetroGamePostCard from "@/components/RetroGamePostCard.vue";
import {authService, directus} from "@/services/directus.service";
import IRetroGamePosts from "@/Interface/IRetroGamePosts"
import router from "@/router";
import { GoogleMap } from '@capacitor/google-maps';

const userAccessToken = localStorage.getItem('auth_token');

const retroGamePosts = ref([]);

onIonViewDidEnter(async () => {
  await fetchRetroGamePosts();
  await createMap()
})

const loggOff = () => {
  authService.logout()
  router.replace('/auth');
}

const fetchRetroGamePosts = async () => {
  const response = await directus.graphql.items<IRetroGamePosts>(`
  query MyQuery {
  retroGames_posts {
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

const createMap = async () => {
  const mapRef = document.getElementById('map');

  const newMap = await GoogleMap.create({
    id: 'my-map', // Unique identifier for this map instance
    element: mapRef, // reference to the capacitor-google-map element
    apiKey: 'AIzaSyBho7xvaEqMLq5Vj5ZNfoWmEiAYfhIDMe0', // Your Google Maps API Key
    config: {
      center: {
        // The initial position to be rendered by the map
        lat: 59.911491,
        lng: 10.757933,
      },
      zoom: 12, // The initial zoom level to be rendered by the map
    },
  });

  retroGamePosts.value.map(async (post) => {
    const markerId = await newMap.addMarker({
      coordinate: {
        lat: post.location.coordinates[1],
        lng: post.location.coordinates[0]
      }
    });
  });
};
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>NostalgiGames 🕹</ion-title>
      </ion-toolbar>
      <ion-card>
        <ion-card-content>
          <p>Velkommen til Nostalgia Shop! Hos oss kan du se på annonser og kontakte selgere. Om du ønsker å legge ut
            ditt eget annonse, så må du registrere deg og logge inn. </p>
        </ion-card-content>
      </ion-card>
      <capacitor-google-map id="map"></capacitor-google-map>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" pull-factor="0.5" pull-min="100" pull-max="200" @ionRefresh="doRefresh($event)">
        <ion-refresher-content :pulling-icon="chevronDownCircleOutline"
                               pulling-text="Pull to refresh"
                               refreshing-spinner="circles"
                               refreshing-text="Refreshing..."></ion-refresher-content>
      </ion-refresher>

      <retro-game-post-card v-for="post in retroGamePosts" :key="post.id" :post="post" :user-access-token="userAccessToken"/>

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

capacitor-google-map {
  display: block;
  margin: auto;
  width: auto;
  height: 400px;
  border: 5px solid;
  border-radius: 5px;
}

p {
  font-weight: bold;
}

ion-label {
  white-space: nowrap;
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  line-height: 24px;
  padding: 4px 4px;
  border-radius: 4px;
}
</style>
