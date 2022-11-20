<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  onIonViewDidEnter
} from '@ionic/vue';
import {
  addCircleOutline,
  chevronDownCircleOutline,
  logIn,
  logOut,
  mapOutline,
  personCircleOutline,
  settings,
} from "ionicons/icons";
import {ref} from 'vue';
import RetroGamePostCard from "@/components/RetroGamePostCard.vue";
import {authService, directus} from "@/services/directus.service";
import IRetroGamePosts from "@/Interface/IRetroGamePost"
import {useRouter} from "vue-router";

// Bruker auth_token for å sjekke om brukeren er logget inn eller ikke, lag til mer detaljert forklaring på template delen
const userAccessToken = localStorage.getItem('auth_token');

// Lager et tomt array av typen IRetroGamePosts som skall fylles med verdier fra fethcRetroGamePosts
const retroGamePosts = ref<IRetroGamePosts>([]);

//For å kunne gå til ønsket side
const router = useRouter();

onIonViewDidEnter(async () => {
  await fetchRetroGamePosts();
})

// Sletter auth_token og går tilbake til login/registrer siden
const loggOff = () => {
  authService.logout()
  router.replace('/auth');
}

const fetchRetroGamePosts = async () => {
  const fullResponse = await directus.graphql.items<IRetroGamePosts>(`
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
    plattform
    state
    price
    location
  }
}
`)

  if (fullResponse.status === 200 && fullResponse.data) {
    retroGamePosts.value = [...fullResponse.data.retroGames_posts];
  }
}

//Når man drar ned på siden, så blir fetch fuknsjonen kalt på nytt, og deretter stopper
const doRefresh = async (event: CustomEvent) => {
  await fetchRetroGamePosts();
  event.target.complete();
}

// For hver gang et tegn blir lagt til i søkefeltet så flitrer den innholdet til tidligere nevnt array utifra søkefeltet
const handleChange = async (event: CustomEvent) => {
  const query = event.target.value.toLowerCase();
  //Hvis felter er tomt, så skal tidligere nevnt funksjon kjøres
  if (query == ''){
    await fetchRetroGamePosts();
  }
  const filterResponse = await directus.graphql.items<IRetroGamePosts>(`
 query MyQuery {
 retroGames_posts(filter: {title: {_contains: "${query}"}}) {
   id
   images {
     id
   }
   title
   description
   plattform
   state
   location
 }
}

`)
  if (filterResponse.status === 200 && filterResponse.data) {
    retroGamePosts.value = [...filterResponse.data.retroGames_posts];
  }
}
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>NostalgiShop 🕹</ion-title>
        <ion-buttons slot="primary">
          <!--Man skal kunne gå til bruker siden hvis man er logget inn-->
          <ion-button v-if="userAccessToken" router-link="/userPage">
            <ion-icon slot="icon-only" :icon="personCircleOutline"/>
          </ion-button>
          <ion-button router-link="/postsMap">
            <ion-icon slot="icon-only" :icon="mapOutline"/>
          </ion-button>
        </ion-buttons>
        <ion-progress-bar v-if="retroGamePosts.length <= 0" :buffer="0.001"></ion-progress-bar> <!--Skal kun vises når fetch arrayet av posts er tomt-->
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" pull-factor="0.8" pull-min="100" pull-max="200" @ionRefresh="doRefresh($event)"> <!--Forklart i script-->
        <ion-refresher-content :pulling-icon="chevronDownCircleOutline"
                               pulling-text="Pull to refresh"
                               refreshing-spinner="circles"
                               refreshing-text="Refreshing..."></ion-refresher-content>
      </ion-refresher>
      <ion-searchbar show-clear-button="focus" placeholder="Søk på tittel"  :debounce="200" @ionChange="handleChange($event)" /> <!--Forklart i script-->
      <ion-card>
        <ion-card-content>
          <p>Velkommen til NostalgiShop! Her kan du se på annonser som er lagt ut! Om du ønsker å legge ut
            ditt eget annonse, eller kontakte selgeren, så må du registrere deg og logge inn. </p>
        </ion-card-content>
      </ion-card>

      <retro-game-post-card v-for="post in retroGamePosts" :key="post.id" :post="post"/> <!--Bruker komponent med props-->

      <ion-fab vertical="bottom" horizontal="end" slot="fixed"> <!--Viser kun loggin knappen hvis man ikke er logget inn-->
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
</style>
