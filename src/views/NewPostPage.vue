<script setup lang="ts">
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar
} from "@ionic/vue";
import {Camera, CameraResultType} from "@capacitor/camera";
import {directus} from "@/services/directus.service";

const postNewCampSpot = async () => {
  /*if (!campingSpot.image) {
    alert("BILDE REQUIRED")
    return;
  }*/

  try {
    const res = await fetch("")
    const imgBlob = await res.blob();

    const formData = new FormData();
    formData.append('file', imgBlob);
    const fileUpload = await directus.files.createOne(formData)

    if (fileUpload){
      await directus.items('camping_spots').createOne({
        title: "",
        description: "",
        hashtags: "",
        image: fileUpload.id
      })
    }
  }catch (e) {
    console.error(e)
  }

}

const openCamera = async () => {
  const pic = await Camera.getPhoto({
    quality: 100,
    allowEditing: false,
    resultType: CameraResultType.Uri
  })

  if (pic.webPath) {
    //newCampSpot.value.image = pic.webPath
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
        <ion-button v-if="'!newCampSpot.image'" @click="openCamera" color="light" class="imageBtn">Velg fil 🖼 eller ta et bilde 📸</ion-button>

        <img v-if="'newCampSpot.image'" @click="openCamera" :src="'newCampSpot.image'"/>

        <ion-item>
          <ion-label position="floating">Tittel</ion-label>
          <ion-input type="text" v-model="kk"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Description</ion-label>
          <ion-textarea v-model="ll"></ion-textarea>
        </ion-item>

        <ion-button  @click="postNewCampSpot">Legg til spot 🏕</ion-button>
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