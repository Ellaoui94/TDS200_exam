import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import NewPostPage from '../views/NewPostPage.vue'
import RegisterOrLoginPage from '../views/RegisterOrLoginPage.vue'
import PostsMapPage from '../views/PostsMapPage.vue'
import PostDetailPage from '../views/PostDetailPage.vue'
import UserPage from '../views/UserPage.vue'
import PostChatPage from '../views/PostChatPage.vue'
import {toastController} from "@ionic/vue";
import {authService} from "@/services/directus.service";


const authenticationRequiredRouteGuard = async () => {
  const userAccessToken = localStorage.getItem('auth_token')

  if (!userAccessToken){
    return { name: "Home"}
  }

  const userAccessTokenExpiresAt = localStorage.getItem('auth_expires_at') as unknown as number;

  if (userAccessTokenExpiresAt < new Date().getTime()){

    const errorToast = await toastController.create({
      message: "Brukersejson er utløpt - logg inn på nytt",
      duration: 3000,
      color: "warning"
    })

    await errorToast.present();

    await authService.logout();
    return {name: "RegisterOrLogin"}
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/newPost',
    name: 'NewPost',
    component: NewPostPage,
    beforeEnter: [authenticationRequiredRouteGuard]
  },
  {
    path: '/auth',
    name: 'RegisterOrLogin',
    component: RegisterOrLoginPage,
  },
  {
    path: '/postsMap',
    name: 'PostsMapPage',
    component: PostsMapPage,
  },
  {
    path: '/postDetail/:id',
    name: 'PostDetailPage',
    component: PostDetailPage,
  },
  {
    path: '/postChat/:id/:email',
    name: 'PostChatPage',
    component: PostChatPage,
  },
  {
    path: '/userPage',
    name: 'UserPage',
    component: UserPage,
    beforeEnter: [authenticationRequiredRouteGuard]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
