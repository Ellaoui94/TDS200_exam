<script setup lang="ts">
import {ref} from "vue";
import {IonPage, IonContent} from "@ionic/vue";
import IRetroGamePosts from "@/Interface/IRetroGamePosts";
import {directus} from "@/services/directus.service";
import {GoogleMap} from "@capacitor/google-maps";
import {onIonViewDidEnter} from "@ionic/vue";

const retroGamePosts = ref<IRetroGamePosts>([]);

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

onIonViewDidEnter(async () => {
  await fetchRetroGamePosts();
  await createMap();
})
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <p>tetestg</p>
      <capacitor-google-map id="map"></capacitor-google-map>
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

</style>