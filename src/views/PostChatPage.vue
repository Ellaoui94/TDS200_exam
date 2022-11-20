<script setup lang="ts">
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  IonProgressBar,
  onIonViewDidEnter,
  toastController
} from "@ionic/vue";
import {useRoute} from "vue-router";
import {authService, directus} from "@/services/directus.service";
import {sendSharp} from "ionicons/icons";
import IPostChat from "@/Interface/IPostChat"
import {ref} from "vue";

/*
På denne siden har jeg bare prøvd meg fram og kommet fram til en greit nok fungerende løsning
Vil ikke si meg fornøyd og det er mye som må forbedres og fikses på, men det får gå for nå
*/
const route = useRoute();
const {id, email} = route.params; //Henter både id og email fra posten sitt parameter, for å kunne filtrere queryen

const isLoading = ref(false);
const newMessageText = ref('');
const postOwnerChat = ref([]);
const postCustomerChat = ref([]);

const allMessagesArray = ref([]);

const currentUser = ref({});

const loadChat = async () => {
  currentUser.value = await authService.currentUser(); //Henter brukeren som er pålogget for filtrereing av queryen

  const postOwnerMessageResponse = await directus.graphql.items<IPostChat>(`
query MyQuery {
  retroGames_posts_by_id(id: "${id}") {
    retroGame_post_chat_fk(filter: {user_created: {email: {_eq: "${email}"}}}) {
      message
      date_created
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

  //filtrere etter bruker som er pålogget akkurat nå og eieren av posten som man er inni

  const postCustomerMessageResponse = await directus.graphql.items<IPostChat>(`
 query MyQuery {
  retroGames_posts_by_id(id: "${id}") {
    retroGame_post_chat_fk(filter: {user_created: {email: {_eq: "${currentUser.value.email}"}}}) {
      message
      date_created
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

  const ownerMessage = postOwnerMessageResponse.data;
  const customerMessage = postCustomerMessageResponse.data;

  if (postOwnerMessageResponse.status && postCustomerMessageResponse.status === 200 && ownerMessage && customerMessage) {
    postOwnerChat.value = [...postOwnerMessageResponse.data.retroGames_posts_by_id.retroGame_post_chat_fk];
    postCustomerChat.value = [...postCustomerMessageResponse.data.retroGames_posts_by_id.retroGame_post_chat_fk];
  }

//Hvis en kunde ikke har sendt noe melding, så skal ikke eieren ha noe melding heller PS: Ikke fornøyd med dette
  if (postCustomerChat.value.length == 0) {
    postOwnerChat.value = [];
  }

  allMessagesArray.value = postOwnerChat.value.concat(postCustomerChat.value); //Merger begge arrayene inni et

  allMessagesArray.value.sort(
      (owner, customer) => Number(new Date(owner.date_created)) - Number(new Date(customer.date_created)),
  );
  //sorterer de etter dato

  isLoading.value = false
}
const addNewMessage = async () => {
  if (newMessageText.value) {
    try {
      await directus.items('retroGames_post_chat').createOne({
        message: newMessageText.value,
        retroGames_post_fk: id, // legger til en melding og posten sitt id
      })
    } catch (e) {
      if (e.message == "You don't have permission to access this.") { //for å gjøre feilmeldingen til norsk
        await (await toastController.create({
          message: `Du må være innlogget `,
          duration: 3000,
          color: "warning"
        })).present();
        return;
      }
      await (await toastController.create({
        message: `${e}`,
        duration: 3000,
        color: "warning"
      })).present();
    }
  }

  newMessageText.value = "";
  isLoading.value = true
  await loadChat();
}

onIonViewDidEnter(async () => {
  await loadChat();
})

// For å oppdatere meldinger, ikke fornøyd med dette heller
setInterval(async () => {
  await loadChat();
}, 5000);
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Meldinger</ion-title>
        <ion-button router-link="/" slot="start">Tilbake</ion-button>
      </ion-toolbar>
      <ion-progress-bar v-if="isLoading" :buffer="0.001"></ion-progress-bar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-card>
          <ion-item v-for="msg in allMessagesArray" :key="msg" lines="none">
            <ion-avatar slot="start">
              <img :src="`https://7qp4jl4l.directus.app/assets/${msg.user_created.avatar.id}`" alt="User Image"/>
            </ion-avatar>
            <ion-label class="ion-text-wrap">
              <ion-header>
                <b>{{ msg.user_created.first_name }}</b>
              </ion-header>
              <ion-text>
                <h3>{{ msg.message }}</h3>
              </ion-text>
            </ion-label>
          </ion-item>
        </ion-card>
      </ion-list>
      <ion-textarea style="resize: both" placeholder="Skriv en melding" v-model="newMessageText"></ion-textarea>
      <ion-button style="width: 100%" class="modalBtn" @click="addNewMessage">
        <ion-icon :icon="sendSharp"/>
      </ion-button>
    </ion-content>
  </ion-page>
</template>