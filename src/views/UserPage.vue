<script setup lang="ts">
import {authService, directus} from "@/services/directus.service";
import {
  actionSheetController,
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonProgressBar,
  IonToolbar,
  IonTitle,
  onIonViewDidEnter
} from "@ionic/vue";
import {ref} from "vue";
import {useRouter} from "vue-router";
import IRetroGamePosts from "@/Interface/IRetroGamePost";
import IPostChats from "@/Interface/IPostChat"
import RetroGamePostCard from "@/components/RetroGamePostCard.vue";

const currentUser = ref({});
const router = useRouter();
const isModalOpen = ref(false);

const retroGamePosts = ref<IRetroGamePosts>([]); // laget ref for alle modellene i directus som blir brukt av brukeren
const retroGamePostsChat = ref<IPostChats>([]);
const retroGamePostsComments = ref([]);

// fetcher alt som brukeren har lagt ut for å kunne hente idene deres så jeg kan slette de
const fetchRetroGamePosts = async () => {
  const response = await directus.graphql.items<IRetroGamePosts>(`
 query MyQuery {
  retroGames_posts(filter: {user_created: {email: {_eq: "${currentUser.value.email}"}}}) {
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
    location
  }
}

`)

  if (response.status === 200 && response.data) {
    retroGamePosts.value = [...response.data.retroGames_posts];
  }
}


const fetchRetroGameChatIDs = async () => {
  const response = await directus.graphql.items<IRetroGamePosts>(`
query MyQuery {
  retroGames_post_chat(filter: {user_created: {email: {_eq: "${currentUser.value.email}"}}}) {
    id
  }
}

`)

  if (response.status === 200 && response.data) {
    retroGamePostsChat.value = [...response.data.retroGames_post_chat];
  }
}


const fetchRetroGameMessageIDs = async () => {
  const response = await directus.graphql.items<IRetroGamePosts>(`
query MyQuery {
  retroGames_post_comments(filter: {user_created: {email: {_eq: "${currentUser.value.email}"}}}) {
    id
  }
}

`)

  if (response.status === 200 && response.data) {
    retroGamePostsComments.value = [...response.data.retroGames_post_comments];
  }
}

onIonViewDidEnter(async () => {
  currentUser.value = await authService.currentUser();
  await fetchRetroGamePosts();
  await fetchRetroGameChatIDs();
  await fetchRetroGameMessageIDs();
})

//her så sletter alt innhold og brukeren ved å bruke id-ene
const deleteCurrentUser = async () => {
  retroGamePosts.value.map(async (post) => {
    await directus.items('retroGames_posts').deleteMany([post.id])
  })
  retroGamePostsComments.value.map(async (comment) => {
    await directus.items('retroGames_post_comments').deleteMany([comment.id])
  })
  retroGamePostsChat.value.map(async (msg) => {
    await directus.items('retroGames_post_chat').deleteMany([msg.id])
  })
  await directus.users.deleteOne(currentUser.value.id);
  localStorage.removeItem('auth_token');
  location.reload();
  await router.replace('/');
}

const updatedUser = ref({
  first_name: '',
  email: '',
})

// har en modal hvor brukeren kan endre infoen sin som lukker seg etter denne funksjonen har blitt kalt på
const updateCurrentUser = async () => {
  await directus.users.updateOne(currentUser.value.id, {
    first_name: updatedUser.value.first_name,
    email: updatedUser.value.email
  })
  isModalOpen.value = false;
  currentUser.value = await authService.currentUser();
}

const presentActionSheet = async () => {
  //Brukeren for en popup hvis han velger "Slett" knappen som kjører slette funksjonen
  const actionSheet = await actionSheetController.create({
    header: 'Brukeren din og all innhold blir slettet permanent',
    buttons: [
      {
        text: 'Slett',
        role: 'destructive',
        data: {
          action: 'delete',
        },
      },
      {
        text: 'Avbryt',
        role: 'cancel',
        data: {
          action: 'cancel',
        },
      },
    ],
  });

  await actionSheet.present();

  const res = await actionSheet.onDidDismiss();
  if (res.data.action == "delete") {
    await deleteCurrentUser();
  }

};
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button router-link="/"></ion-back-button>
        </ion-buttons>
        <ion-progress-bar v-if="!currentUser.avatar" :buffer="0.001"></ion-progress-bar> <!--Siden bilde tar tid å laste opp, så må vi ha if for at siden ikke skal kræsje-->
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-avatar>
        <img :src="`https://7qp4jl4l.directus.app/assets/${currentUser.avatar}`" alt="userImg"/>
      </ion-avatar>
      <ion-card>
        <ion-card-header>
          <h1>{{ currentUser.first_name }}</h1>
        </ion-card-header>
        <ion-card-content>
          <h3>{{ currentUser.email }}</h3>
        </ion-card-content>
      </ion-card>
      <ion-buttons class="profilePageBtns">
        <ion-button @click="isModalOpen = true" fill="solid" color="dark" size="default">
          Endre bruker
        </ion-button>

        <ion-button @click="presentActionSheet" fill="solid" color="dark" size="default">
          Slett bruker 😢
        </ion-button>
      </ion-buttons>

      <ion-card>
        <ion-card-content>
          <p>Annonser lagt ut av deg </p>
        </ion-card-content>
      </ion-card>

      <retro-game-post-card v-for="post in retroGamePosts" :key="post.id" :post="post"/>

      <ion-modal :is-open="isModalOpen" @did-dismiss="isModalOpen = false">
        <ion-content>
          <ion-toolbar>
            <ion-title>Endring av bruker informasjon</ion-title>
            <ion-buttons slot="end">
              <ion-button color="light" @click="isModalOpen = false">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
          <ion-item lines="none">
            <ion-label position="floating">Nytt navn:</ion-label>
            <ion-input type="text" placeholder="Navn" v-model="updatedUser.first_name"/>
            <ion-label position="floating">Email:</ion-label>
            <ion-input type="text" v-on:keyup.enter="updateCurrentUser" v-model="updatedUser.email"
                       placeholder="Email"/>
            <ion-button @click="updateCurrentUser" style="width: 100%; margin-top: 100px" class="modalBtn">
              Endre
            </ion-button>
          </ion-item>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>

</template>

<style scoped>
ion-avatar {
  width: 100%;
  height: 50%;
}

h1, h3 {
  color: #ffffff;
}

.profilePageBtns {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

ion-modal {
  --height: 50%;
  --border-radius: 16px;
  --box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

ion-modal::part(backdrop) {
  background: rgba(209, 213, 219);
  opacity: 1;
}

ion-modal ion-toolbar {
  --background: rgb(14 116 144);
  --color: white;
}
</style>