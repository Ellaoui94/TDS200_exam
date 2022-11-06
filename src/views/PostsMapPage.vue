<script setup lang="ts">
import {ref} from "vue";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonSpinner,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonItem,
  IonProgressBar, onIonViewWillLeave
} from "@ionic/vue";
import IRetroGamePosts from "@/Interface/IRetroGamePosts";
import {directus} from "@/services/directus.service";
import {GoogleMap} from "@capacitor/google-maps";
import {onIonViewDidEnter} from "@ionic/vue";
import {useRouter} from "vue-router";

const retroGamePosts = ref<IRetroGamePosts>([]);
const router = useRouter();

const fetchRetroGamePosts = async () => {
  const response = await directus.graphql.items<IRetroGamePosts>(`
  query MyQuery {
  retroGames_posts {
    id
    images {
      directus_files_id {
        id
      }
    }
    title
    description
    location
  }
}
`);

  if (response.status === 200 && response.data) {
    retroGamePosts.value = [...response.data.retroGames_posts];
  }
}

const createMap = async () => {
  const mapRef = document.getElementById('map');

  const newMap = await GoogleMap.create({
    id: 'my-map', // Unique identifier for this map instance
    element: mapRef, // reference to the capacitor-google-map element
    apiKey: 'AIzaSyBQaiG2nK8exSsqrTPWclIDXrmbi1XlcJQ', // Your Google Maps API Key
    config: {
      center: {
        // The initial position to be rendered by the map
        lat: 59.911491,
        lng: 10.757933,
      },
      zoom: 10, // The initial zoom level to be rendered by the map
    },
  });

  retroGamePosts.value.map(async (post) => {
    const markerId = await newMap.addMarker({
      coordinate: {
        lat: post.location.coordinates[0],
        lng: post.location.coordinates[1]
      }
    });
    await newMap.setOnMarkerClickListener((marker) => {
      if (marker.latitude === post.location.coordinates[0] ){
        router.replace(`/postDetail/${post.id}`)
      }
    })
  });
}

onIonViewDidEnter(async () => {
  await fetchRetroGamePosts();
  await createMap();
})

onIonViewWillLeave(()=> {
  location.reload();
})

</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button router-link="/"></ion-back-button>
        </ion-buttons>
        <ion-spinner v-if="!createMap" style="margin-left: 30px" name="circular"></ion-spinner>
        <p>Kart over annonser</p>
      </ion-toolbar>
      <ion-progress-bar v-if="retroGamePosts.length === 0" :buffer="0.001"></ion-progress-bar>
    </ion-header>
    <ion-item>
    <ion-card>
      <ion-card-content>
        <p style="opacity: 102"> Her finner annonser der hvor de er postet fra, trykk på en for mer info</p>
      </ion-card-content>
    </ion-card>
    </ion-item>
    <ion-content :fullscreen="true">
      <capacitor-google-map id="map"></capacitor-google-map>
    </ion-content>
  </ion-page>
</template>

<style scoped>

capacitor-google-map {
  display: block;
  margin: auto;
  width: auto;
  height: 100%;
  border: 5px solid;
  border-radius: 5px;
}

ion-content {
  --background: none;
}

body {
  opacity: 0.2;
}

</style>