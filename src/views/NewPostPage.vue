<script setup lang="ts">
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonTextarea,
  IonTitle,
  IonToolbar, toastController,
  IonChip,
  IonSelect,
  IonSelectOption,
  IonCol,
  IonProgressBar
} from "@ionic/vue";
import {Camera, CameraResultType} from "@capacitor/camera";
import {directus} from "@/services/directus.service";
import {ref} from "vue";
import RetroGameNewPostImages from "@/components/RetroGameNewPostImages.vue";
import {Geolocation} from '@capacitor/geolocation';
import {useRouter} from "vue-router";

const router = useRouter();
const newRetroGamePost = ref({
  images: {},
  title: '',
  description: '',
  plattform: [],
  price: 0,
  state: "",
  location: {
    type: '',
    coordinates: []
  },
})

newRetroGamePost.value.price = '' as unknown as number;

const newRetroGamePostImages = ref([]);
const newPlatForm = ref('');
const status = ref(["Brukt", "Ubrukt", "Solgt"]);
const isLoading = ref(false);

const addNewPlatform = () => {
  if (newPlatForm.value) {
    newRetroGamePost.value.plattform.push(newPlatForm.value)
    newPlatForm.value = "";
  }
}

const postNewRetroGame = async () => {
  if (newRetroGamePostImages.value.length === 0) {
    alert("Må ha med bilde(r) av produktet")
    return;
  }
  const imagesResult = newRetroGamePostImages.value.map(async (image) => {
    const res = await fetch(image)
    const imgBlob = await res.blob();
    const formData = new FormData();
    formData.append('file', imgBlob);
    const fileUpload = await directus.files.createOne(formData)
    return {
      directus_files_id: {
        id: fileUpload.id
      }
    }
  })
  newRetroGamePost.value.images = [...await Promise.all(imagesResult)];
  try {
    isLoading.value = true;
    await directus.items('retroGames_posts').createOne({
      images: newRetroGamePost.value.images,
      title: newRetroGamePost.value.title,
      description: newRetroGamePost.value.description,
      plattform: newRetroGamePost.value.plattform,
      price: newRetroGamePost.value.price,
      state: newRetroGamePost.value.state,
      location: newRetroGamePost.value.location
    })
    await router.replace('/home');

  } catch (e) {
    await (await toastController.create({
      message: `${e}`,
      duration: 3000,
      color: "warning"
    })).present();
  }
}

const printCurrentPosition = async () => {
  const coordinates = await Geolocation.getCurrentPosition()
  return coordinates.coords
};

printCurrentPosition().then((s) => {
  newRetroGamePost.value.location = {
    type: "Point",
    coordinates: [
      s.latitude,
      s.longitude
    ]
  }

});


const openCamera = async () => {
  const pic = await Camera.getPhoto({
    quality: 100,
    allowEditing: false,
    resultType: CameraResultType.Uri
  })

  if (pic.webPath) {
    newRetroGamePostImages.value.push(pic.webPath)
  }
}
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button router-link="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Nostalgia Shop 🕹</ion-title>
      </ion-toolbar>
      <ion-progress-bar v-if="isLoading" :buffer="0.001"></ion-progress-bar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-button v-if="newRetroGamePostImages.length === 0" @click="openCamera" color="light" class="imageBtn">Velg
          fil 🖼 eller ta
          et bilde 📸
        </ion-button>

        <ion-grid v-if="newRetroGamePostImages.length">
          <ion-row>
            <retro-game-new-post-images v-for="image in newRetroGamePostImages" :key="image"
                                        :image-src="image"/>
          </ion-row>
        </ion-grid>
        <ion-button v-if="newRetroGamePostImages.length" @click="openCamera">Legg til bilder(r) 📷</ion-button>


        <ion-item>
          <ion-label position="floating">Tittel</ion-label>
          <ion-input type="text" v-model="newRetroGamePost.title"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Description</ion-label>
          <ion-textarea v-model="newRetroGamePost.description"></ion-textarea>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Plattform:</ion-label>
          <ion-input v-on:keyup.enter="addNewPlatform" v-model="newPlatForm"></ion-input>

          <ion-button slot="end" style="width: 20vh" size="default" @click="addNewPlatform">Legg til</ion-button>
        </ion-item>

        <ion-item lines="none">
          <ion-chip color="primary" v-for="platform in newRetroGamePost.plattform" :key="platform">{{ platform }}
          </ion-chip>
        </ion-item>

        <ion-row>
          <ion-col>
            <ion-item>
              <ion-select interface="action-sheet" placeholder="Velg tilstand"
                          @ionChange="newRetroGamePost.state = $event.detail.value">
                <ion-select-option v-for="state in status" :key="state" :value="state">{{ state }}</ion-select-option>
              </ion-select>
            </ion-item>
          </ion-col>
          <ion-col>
            <ion-item>
              <ion-label position="floating">Pris:</ion-label>
              <ion-input type="number" v-on:keyup.enter="postNewRetroGame" v-model="newRetroGamePost.price"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-button @click="postNewRetroGame">Legg til artikkel</ion-button>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.imageBtn {
  margin: 10px;
  height: 20vh;
  border: 2px #8a8a8a dashed;
  border-radius: 8px;
  font-size: small;
}

ion-content {
  display: flex;
}

ion-list {
  display: flex;
  flex-direction: column;
}

ion-button {
  color: black;
}
</style>