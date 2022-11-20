<script setup lang="ts">
import {ref} from "vue";
import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonItem,
  IonPage,
  IonProgressBar,
  IonSpinner,
  IonToolbar,
  onIonViewDidEnter,
  onIonViewWillLeave
} from "@ionic/vue";
import IRetroGamePosts from "@/Interface/IRetroGamePost";
import {directus} from "@/services/directus.service";
import {GoogleMap} from "@capacitor/google-maps";
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
  const mapRef = document.getElementById('map'); //Henter elementet/div-en som har id-en "Kartet"

  const newMap = await GoogleMap.create({
    id: 'my-map', // Unique identifier for this map instance
    element: mapRef, // reference to the capacitor-google-map element
    apiKey: 'AIzaSyBQaiG2nK8exSsqrTPWclIDXrmbi1XlcJQ', // Your Google Maps API Key
    config: {
      center: {
        // The initial position to be rendered by the map
        lat: 59.911491,
        lng: 10.757933, // Oslo
      },
      zoom: 10, // The initial zoom level to be rendered by the map
    },
  });

  //Mapper gjennom artikler for å hente alle artiklene som finnes og legger til kordinatene deres
  retroGamePosts.value.map(async (post) => {
    await newMap.addMarker({
      coordinate: {
        lat: post.location.coordinates[0],
        lng: post.location.coordinates[1]
      }
    });

    //Henter id-en fra posten som markøren gjelder. Hvis jeg ikke har med if-statement, så blir hvert markør det siste innholdet i arrayet
    await newMap.setOnMarkerClickListener((marker) => {
      if (marker.latitude === post.location.coordinates[0]) {
        router.replace(`/postDetail/${post.id}`)
      }
    })
  });
}

onIonViewDidEnter(async () => {
  await fetchRetroGamePosts();
  await createMap();
})

//Bruker location.reload for å fikse loading buggen
onIonViewWillLeave(() => {
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
        <!--For å teste og se at både spinner og progressbar fungerer-->
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