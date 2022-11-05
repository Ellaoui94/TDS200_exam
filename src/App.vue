<template>
  <ion-app>
    <ion-router-outlet/>
  </ion-app>
</template>

<script lang="ts">
import {IonApp, IonRouterOutlet} from '@ionic/vue';
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  }
});
</script>

<style>
* {
  font-family: "Retro Gaming";
  font-size: medium;
}

body {
  background-color: #242424;
}

ion-spinner {
  --color: #52ffe4;
}

ion-button {
  --background: linear-gradient(43deg, #ff0000 0%, #ffa500 46%, #ff0000 100%);
}

ion-chip {
  color: #52ffe4;
}
</style>