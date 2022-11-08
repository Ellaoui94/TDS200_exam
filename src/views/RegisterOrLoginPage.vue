<script setup lang="ts">
import {ref} from "vue";
import {authService, directus} from "@/services/directus.service";
import {useRouter} from "vue-router";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonProgressBar,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
  onIonViewDidLeave,
  toastController
} from '@ionic/vue';
import {Camera, CameraResultType} from "@capacitor/camera";
import IUserDetails from "@/Interface/IUserDetails";
import defaultUserImage from "@/components/defaultUserImage";

let registerMode = ref(false);
let segmentDefMode = ref('login');
const isLoading = ref(false);
const router = useRouter();

onIonViewDidLeave(()=> {
  location.reload();
})

//Trenger kanskje ikke interface????????????
const userDetails = ref<IUserDetails>({
  firstName: '',
  email: '',
  password: '',
  avatar: {
    id: 0
  }
});

const login = async () => {
  isLoading.value = true
  try {
    await authService.login(userDetails.value.email, userDetails.value.password);
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
  isLoading.value = true
  try {
    let res = await fetch(userDetails.value.avatar.id)

    // explain this
    if (segmentDefMode.value === 'login') {
      res = await fetch(defaultUserImage);
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
    if (e.message == "\"refresh_token\" is required in either the JSON payload or Cookie"){
      await (await toastController.create({
        message: `Du må trykke en gang til. Beklager, vi jobber med å fikse dette problemet`,
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


const openCamera = async () => {
  const pic = await Camera.getPhoto({
    quality: 100,
    allowEditing: false,
    resultType: CameraResultType.Uri
  })
  if (pic.webPath) {
    segmentDefMode.value = 'register';
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
            <ion-segment :value="segmentDefMode">
              <ion-segment-button @click="registerMode = false" value="login">
                <ion-label>Login</ion-label>
              </ion-segment-button>
              <ion-segment-button @click="registerMode = true" value="register">
                <ion-label>Registrer deg</ion-label>
              </ion-segment-button>
            </ion-segment>
          </ion-toolbar>
          <ion-progress-bar v-if="isLoading" :buffer="0.001"></ion-progress-bar>
        </ion-header>

        <ion-button v-if="!userDetails.avatar.id && registerMode" @click="openCamera" color="light" class="imageBtn">
          Velg fil 🖼 eller ta et bilde 📸
        </ion-button>

        <img class="hero-image" v-if="!registerMode" src="../../public/assets/defaultUser.png"/>
        <img class="hero-image" v-if="registerMode && userDetails.avatar.id" :src="userDetails.avatar.id"/>
        <ion-button v-if="registerMode && userDetails.avatar.id" @click="openCamera">Endre bilde 🔄</ion-button>

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
          <ion-input v-if="!registerMode" v-on:keyup.enter="login" type="password" v-model="userDetails.password"/>
          <ion-input v-if="registerMode" v-on:keyup.enter="register" type="password" v-model="userDetails.password"/>
        </ion-item>

        <ion-buttons class="loginRegisterBtns">
          <ion-button router-link="/" class="button-auth" fill="solid" color="dark" size="default">
            Tilbake
          </ion-button>

          <ion-button v-if="registerMode" @click="register" class="button-auth" fill="solid" color="dark"
                      size="default">
            Registrer deg 🕹
          </ion-button>

          <ion-button v-else @click="login" class="button-auth" fill="solid" color="dark" size="default">
            Logg inn 🕹
          </ion-button>
        </ion-buttons>
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

ion-list {
  display: flex;
  flex-direction: column;
}

.label-mild {
  --color: #8a8a8a !important;
}

.hero-image {
  width: 355px;
  align-self: center;
  background: linear-gradient(white, white) padding-box,
  linear-gradient(to right, red, orange) border-box;
  border-radius: 10%;
  border: 15px solid transparent;

}

.button-auth {
  margin-top: 50px;
  margin-left: 10px;
  margin-right: 10px;
}

.loginRegisterBtns {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>