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
  IonToolbar
} from "@ionic/vue";
import {Camera, CameraResultType} from "@capacitor/camera";
import {directus} from "@/services/directus.service";
import {ref} from "vue";
import RetroGameNewPostImages from "@/components/RetroGameNewPostImages.vue";
import {Geolocation} from '@capacitor/geolocation';

const newRetroGamePost = ref({
  title: '',
  description: '',
  images: {},
  location: {
    type: '',
    coordinates: []
  },
})

const newRetroGamePostImages = ref([]);

const postNewRetroGame = async () => {
  /*if (!campingSpot.image) {
    alert("BILDE REQUIRED")
    return;
  }*/
 const test = newRetroGamePostImages.value.map(async (image) => {
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
  newRetroGamePost.value.images = [...await Promise.all(test)];
  try {
    await directus.items('retroGames_posts').createOne({
      title: newRetroGamePost.value.title,
      description: newRetroGamePost.value.description,
      images: newRetroGamePost.value.images,
      location: newRetroGamePost.value.location
    })
  } catch (e) {
    console.error(e)
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
          <ion-back-button deafult-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Nostalgia Shop 🕹</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-button v-if="newRetroGamePostImages.length === 0" @click="openCamera" color="light" class="imageBtn">Velg
          fil 🖼 eller ta
          et bilde 📸
        </ion-button>

        <ion-grid v-if="newRetroGamePostImages.length">
          <ion-row>
            <retro-game-new-post-images @click="openCamera" v-for="image in newRetroGamePostImages" :key="image"
                                        :image-src="image"/>
          </ion-row>
        </ion-grid>


        <ion-item>
          <ion-label position="floating">Tittel</ion-label>
          <ion-input type="text" v-model="newRetroGamePost.title"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Description</ion-label>
          <ion-textarea v-model="newRetroGamePost.description"></ion-textarea>
        </ion-item>

        <ion-button @click="postNewRetroGame">Legg til artikkel</ion-button>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<style>
.imageBtn {
  margin: 10px;
  height: 20vh;
  border: 2px #8a8a8a dashed;
  border-radius: 8px;
  font-size: medium;
}

ion-content {
  display: flex;
}

ion-list {
  display: flex;
  flex-direction: column;
}
</style>