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

ion-spinner {
  --color: #52ffe4;
}

ion-button {
  --background: linear-gradient(43deg, #ff0000 0%, #ffa500 46%, #ff0000 100%);
}

ion-card{
  --background: linear-gradient(#000000, #242424);
  color: #ffffff;
}

ion-chip {
  --background: #313030;
  color: #52ffe4;
}

ion-progress-bar{
  --background: #52ffe4;
}
</style>