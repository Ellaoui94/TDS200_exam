<script setup lang="ts">
import {ref} from "vue";
import {authService, directus} from "@/services/directus.service";
import {useRouter} from "vue-router";
import {
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
  IonHeader,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  toastController
} from '@ionic/vue';
import {Camera, CameraResultType} from "@capacitor/camera";
import IUserDetails from "@/Interface/IUserDetails"

let registerMode = ref(false);
const router = useRouter();

const userDetails = ref<IUserDetails>({
  firstName: '',
  email: '',
  password: '',
  avatar: {
    id: 0
  }
});

const login = async () => {
  try {
    await authService.login(userDetails.value.email, userDetails.value.password)
    await router.replace('/home');
  } catch (error) {
    await (await toastController.create({
      message: `${error}`,
      duration: 3000,
      color: "warning"
    })).present();
  }
}


const register = async () => {
  try {
    let res = await fetch(userDetails.value.avatar.id)

    // if statement not working as I want it to
    if (!res) {
      const defaultImg = document.createElement('img');
      defaultImg.src = "public/assets/defaultUser.png";
      res = await fetch(defaultImg.src)
      const imgBlob = await res.blob();
      const formData = new FormData();
      formData.append('file', imgBlob);
      const fileUpload = await directus.files.createOne(formData)

      await authService.register(userDetails.value.firstName, userDetails.value.email, userDetails.value.password, fileUpload?.id);
    } else {
      const imgBlob = await res.blob();
      const formData = new FormData();
      formData.append('file', imgBlob);
      const fileUpload = await directus.files.createOne(formData);

      await authService.register(userDetails.value.firstName, userDetails.value.email, userDetails.value.password, fileUpload?.id)
    }
    await login();
  } catch (e) {
    await (await toastController.create({
      message: `${e}`,
      duration: 3000,
      color: "warning"
    })).present();
  }
}


const openCamera = async () => {
  const pic = await Camera.getPhoto({
    quality: 100,
    allowEditing: false,
    resultType: CameraResultType.Uri
  })

  if (pic.webPath) {
    userDetails.value.avatar.id = pic.webPath
  }
}
</script>

<template>
  <ion-page>
    <ion-content>
      <ion-list>
        <ion-header>
          <ion-toolbar>
            <ion-segment value="login">
              <ion-segment-button @click="registerMode = false" value="login">
                <ion-label>Login</ion-label>
              </ion-segment-button>
              <ion-segment-button @click="registerMode = true" value="register">
                <ion-label>Registrer deg</ion-label>
              </ion-segment-button>
            </ion-segment>
          </ion-toolbar>
        </ion-header>

        <ion-button v-if="!userDetails.avatar.id" @click="openCamera" color="light" class="imageBtn">Velg fil 🖼 eller ta
          et bilde 📸
        </ion-button>

        <img class="hero-image" v-else @click="openCamera" :src="userDetails.avatar.id"/>

        <hr/>

        <ion-item v-if="registerMode">
          <ion-label class="label-mild" position="floating">Fornavn</ion-label>
          <ion-input v-model="userDetails.firstName"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label class="label-mild" position="floating">Email</ion-label>
          <ion-input type="email" v-model="userDetails.email"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label class="label-mild" position="floating">Passord</ion-label>
          <ion-input v-on:keyup.enter="login" type="password" v-model="userDetails.password"/>
        </ion-item>

        <div style="display: inline-block">
          <ion-button router-link="/home" class="button-auth" fill="solid" color="dark" size="default">
            Tilbake til hjemmesiden
          </ion-button>

          <ion-button v-if="registerMode" @click="register" class="button-auth" fill="solid" color="dark"
                      size="default">
            Registrer deg 🏕
          </ion-button>

          <ion-button v-else @click="login" class="button-auth" fill="solid" color="dark" size="default">
            Logg inn 🏕
          </ion-button>
        </div>
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
  font-size: medium;
}

ion-content {
  --ion-background-color: #f4f4f4;
  display: flex;
}

ion-list {
  display: flex;
  flex-direction: column;
}

.label-mild {
  --color: #8a8a8a !important;
}

.hero-image {
  width: 80vw;
  align-self: center;
}

.button-auth {
  margin-top: 50px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>