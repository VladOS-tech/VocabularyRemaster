import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import UserHeader from '@/components/UserHeader.vue';
import PhrasesPage from '@/views/UserPages/PhrasesPage.vue'
import AddPhrasePage from '@/views/UserPages/AddPhrasePage.vue'
import AdminHeader from '@/components/AdminHeader.vue';
import LoginPage from "@/views/LoginPage.vue";
import ModeratorMain from "@/views/ModeratorPages/ModeratorMain.vue";
import RequestBlock from "@/components/Moderator/Blocks/RequestBlock.vue";
import PhraseBlockHolder from "@/components/Moderator/Blocks/PhraseBlockHolder.vue";
import AdministratorMain from "@/views/AdminPages/AdministratorMain.vue";
import StaffBlock from "@/components/Administrator/Blocks/StaffBlock.vue";
import store from "@/store";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    components: {
      default: PhrasesPage,
      nav: UserHeader
    }
  },
  {
    path: '/add',
    components: {
      default: AddPhrasePage,
      nav: UserHeader
    }
  },
  {
    path: '/login',
    components: {
      default: LoginPage,
      nav: AdminHeader
    }
  },
  {
    path: '/moderator',
    meta: {
      requiredRole: 'moderator'
    },
    components: {
      default: ModeratorMain,
      nav: AdminHeader,
    },
      children: [{
        path: 'requests',
        component: RequestBlock,
        meta: {
      requiredRole: 'moderator'
    },
      },
      {
        path: 'phrases',
        component: PhraseBlockHolder,
        meta: {
      requiredRole: 'moderator'
    },
      }]
  },
  {
    path: '/admin',
    meta: {
      requiredRole: 'administrator'
    },
    components: {
      default: AdministratorMain,
      nav: AdminHeader,
    },
      children: [{
        path: 'staff',
        component: StaffBlock,
        meta: {
      requiredRole: 'administrator'
    },
      }]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if(to.meta.requiredRole){
    // window.alert(`${store.getters.role} and ${to.meta.requiredRole}`)
    if(store.getters.role !== to.meta.requiredRole){
      next('/login')
    }else{
      next()
    }
  }
  else{
    next()
  }
})

export default router;
