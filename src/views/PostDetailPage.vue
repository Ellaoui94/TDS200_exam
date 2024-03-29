<script setup lang="ts">
/* eslint-disable no-undef */
import {useRoute} from "vue-router";
import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonPage,
  IonProgressBar,
  IonRow,
  IonSlides,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  onIonViewDidEnter,
  toastController
} from "@ionic/vue";

import {chatboxOutline, mailOutline, sendSharp} from 'ionicons/icons';
import {ref} from "vue";
import {directus} from "@/services/directus.service";
import RetroGamePostImage from "@/components/RetroGamePostImage.vue";

const route = useRoute();
const {id} = route.params;

const userAccessToken = localStorage.getItem('auth_token');

const isModalOpen = ref(false);
const newCommentText = ref('');
const address = ref('');

const retroGamePost = ref({});
const comments = ref([]);

const loadPost = async () => {
  const response = await directus.graphql.items<IRetroGamePost>(`
query MyQuery {
  retroGames_posts_by_id(id: ${id}) {
    id
    images {
      id
      directus_files_id {
        id
      }
    }
    title
    description
    plattform
    price
    state
    location
     user_created {
        email
     }
    retroGame_post_comments_fk {
      id
      comment
      user_created {
        first_name
        email
        avatar {
          id
        }
      }
    }
  }
}
`);
  const responseData = response.data

  if (response.status === 200 && responseData) {
    retroGamePost.value = responseData.retroGames_posts_by_id;
    comments.value = responseData.retroGames_posts_by_id.retroGame_post_comments_fk;
  }
}

// Bruker denne url-en med mitt Google-Api nøkkel for å gjøre om kordinatene fra posten til en addresse og sender et json som et resultat
const getAddress = async () => {
  const lat = retroGamePost.value.location.coordinates[0];
  const lng = retroGamePost.value.location.coordinates[1];
  const result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBQaiG2nK8exSsqrTPWclIDXrmbi1XlcJQ`);
  return result.json();
}

onIonViewDidEnter(async () => {
  await loadPost()
  const {results} = await getAddress();
  address.value = results[0].formatted_address; //Siden resultatet sender flere forskjellige adresser av kordinatene, så henter jeg den mest nøyktaige, som er den første
})

const addNewComment = async () => {
  if (newCommentText.value) {
    try {
      await directus.items('retroGames_post_comments').createOne({
        comment: newCommentText.value,
        retroGame_spot_fk: id, //Legger til kommentar med id-en til posten som fremmed nøkkel
      })
    } catch (e) {
      if (e.message == "You don't have permission to access this.") { //Klarte ikke å hente statuset til erroren, så brukte Meldingen istedenfor og skrev en norsk melding istedenfor
        await (await toastController.create({
          message: `Du må være innlogget `,
          duration: 3000,
          color: "warning"
        })).present();
        isModalOpen.value = false;
        return;
      }
      await (await toastController.create({
        message: `${e}`,
        duration: 3000,
        color: "warning"
      })).present();
    }
  }

  newCommentText.value = "";
  isModalOpen.value = false; //Tømmer teksten i modalen og lukker den
  await loadPost();
}
</script>

<template>
  <ion-page>
    <ion-header v-if="!retroGamePost.images" :translucent="true"><!--Vis dette hvis bilde ikke finnes enda -->
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button router-link="/"></ion-back-button>
        </ion-buttons>
        <ion-title v-if="retroGamePost.images">{{ retroGamePost.title }}</ion-title>
        <ion-progress-bar v-else :buffer="0.001"></ion-progress-bar>
      </ion-toolbar>
    </ion-header>

    <ion-header v-else :translucent="true">
      <ion-toolbar>
        <ion-title>{{ retroGamePost.title }}</ion-title>
        <ion-button router-link="/" slot="start">Tilbake</ion-button>
        <ion-button v-if="userAccessToken"
                    :router-link="'/postChat/' + retroGamePost.id + '/' + retroGamePost.user_created.email" slot="end">
          <!--link til melding siden-->
          <ion-icon slot="icon-only" :icon="mailOutline"/>
        </ion-button>
      </ion-toolbar>
    </ion-header>

    <ion-content v-if="retroGamePost.images" :fullscreen="true">

      <ion-slides class="hero-image">
        <retro-game-post-image v-for="image in retroGamePost.images" :key="image.directus_files_id.id"
                               :image-id="image.directus_files_id.id"/>
        <!--Viser bilder som er inni ion-slides for å kunne sveipe gjennom de-->
      </ion-slides>

      <ion-card>
        <ion-card-header>
          <ion-row>
            <ion-col size="9">
              <ion-chip v-for="plattform in retroGamePost.plattform" :key="plattform">{{ plattform }}</ion-chip>
            </ion-col>
            <ion-col size="3">
              <ion-chip style="color: orange">{{ retroGamePost.state }}</ion-chip>
            </ion-col>
          </ion-row>

          <h3>{{ retroGamePost.title }}</h3>
        </ion-card-header>
        <ion-card-content>
          {{ retroGamePost.description }}
          <ion-row>
            <ion-col size="4">
              <h2>Kr{{ retroGamePost.price }}</h2>
            </ion-col>
            <ion-col size="8">
              <ion-label>{{ address }}</ion-label>
            </ion-col>
          </ion-row>
        </ion-card-content>
      </ion-card>
      <ion-card>
        <ion-list>
          <ion-list-header>
            <ion-item>
              <ion-card-title>
                Hva synes du om produktet/selgeren?
              </ion-card-title>
              <ion-buttons slot="end">
                <ion-button @click="isModalOpen = true">
                  <ion-icon size="large" :icon="chatboxOutline"></ion-icon> <!--Åpner modalen-->
                </ion-button>
              </ion-buttons>
            </ion-item>
          </ion-list-header>
          <ion-item v-for="comment in comments" :key="comment.id" lines="none">
            <ion-avatar slot="start">
              <img :src="`https://7qp4jl4l.directus.app/assets/${comment.user_created.avatar.id}`" alt="userImg"/>
            </ion-avatar>
            <ion-label class="ion-text-wrap">
              <ion-header>
                <b>{{ comment.user_created.first_name }}</b>
              </ion-header>
              <ion-text>
                <h3>{{ comment.comment }}</h3>
              </ion-text>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-card>
      <ion-modal
          :is-open="isModalOpen"
          :initial-breakpoint="0.25"
          :breakpoints="[0, 0.25, 0.5, 0.75]"
          @did-dismiss="isModalOpen = false"> <!--Vi kan bestemme høyden av modalen med breakpoints -->
        <ion-content>
          <ion-textarea style="resize: both" placeholder="Legg igjen en kommentar"
                        v-model="newCommentText"></ion-textarea>
          <ion-button style="width: 100%" class="modalBtn" @click="addNewComment">
            <ion-icon :icon="sendSharp"/>
          </ion-button>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>

</template>

<style scoped>

.hero-image {
  background: linear-gradient(#242424, #242424) padding-box,
  linear-gradient(to right, red, orange) border-box;
  border-radius: 10%;
  border: 15px solid transparent;
}

h3, h2, ion-card-title, ion-icon {
  color: #ffffff;
}

.modalBtn {
  --background: linear-gradient(43deg, #ff0000 0%, #ffa500 46%, #ff0000 100%);
}

ion-modal {
  --background: #000000;
}


ion-list-header, ion-item {
  --background: linear-gradient(#000000, #242424);
  color: #FFFFFF;
}

</style>