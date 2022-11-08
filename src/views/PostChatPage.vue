<script setup lang="ts">
import {
  IonCard,
  IonText,
  IonTextarea,
  IonIcon,
  IonItem,
  IonAvatar,
  IonLabel,
  IonHeader,
  IonTitle,
  IonButton,
  IonToolbar,
  IonList,
  IonPage,
  IonContent,
  toastController,
  onIonViewDidEnter
} from "@ionic/vue";
import {useRoute} from "vue-router";
import {authService, directus} from "@/services/directus.service";
import {sendSharp} from "ionicons/icons";
import {ref} from "vue";

const route = useRoute();
const {id, email} = route.params;

const newMessageText = ref('');
const postOwnerChat = ref([]);
const postCustomerChat = ref([]);

const allMessagesArray = ref([]);

const currentUser = ref({});

const loadChat = async () => {
  currentUser.value = await authService.currentUser();

  const postOwnerMessageResponse = await directus.graphql.items(`
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

  const postCustomerMessageResponse = await directus.graphql.items(`
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


  if (postCustomerChat.value.length == 0){
    postOwnerChat.value = [];
  }

  allMessagesArray.value = postOwnerChat.value.concat(postCustomerChat.value);

  allMessagesArray.value.sort(
      (owner, customer) => Number(new Date(owner.date_created)) - Number(new Date(customer.date_created)),
  );
}
const addNewMessage = async () => {
  if (newMessageText.value) {
    try {
      const res = await directus.items('retroGames_post_chat').createOne({
        message: newMessageText.value,
        retroGames_post_fk: id,
      })
    } catch (e) {
      if (e.message == "You don't have permission to access this.") {
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
  await loadChat();
}

onIonViewDidEnter(()=>{
  loadChat();
})

setInterval(async () => {
  await loadChat();
}, 5000);
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>test</ion-title>
        <ion-button router-link="/" slot="start">Tilbake</ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-card>
          <ion-item v-for="msg in allMessagesArray" :key="msg" lines="none">
            <ion-avatar slot="start">
              <img :src="`https://7qp4jl4l.directus.app/assets/${msg.user_created.avatar.id}`"/>
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