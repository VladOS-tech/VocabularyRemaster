import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import UserHeader from '@/components/UserHeader.vue';
import PhrasesPage from '@/views/UserPages/PhrasesPage.vue'
import AddPhrasePage from '@/views/UserPages/AddPhrasePage.vue'
import StaffHeader from '@/components/StaffHeader.vue';
import LoginPage from "@/views/LoginPage.vue";
import ModeratorMain from "@/views/ModeratorPages/ModeratorMain.vue";
import RequestBlock from "@/components/Moderator/Blocks/RequestBlock.vue";
import PhraseBlockHolder from "@/components/Moderator/Blocks/PhraseBlockHolder.vue";
import AdministratorMain from "@/views/AdminPages/AdministratorMain.vue";
import StaffBlock from "@/components/Administrator/Blocks/StaffBlock.vue";
import TagsPage from "@/components/Moderator/Blocks/TagsPage.vue";
import store from "@/store";
import RequestReview from "@/views/ModeratorPages/RequestReview.vue";
import AddModerator from "@/views/AdminPages/AddModerator.vue";
import EditModerator from "@/views/AdminPages/EditModerator.vue";
import DeletionRequestsBlock from "@/components/Administrator/Blocks/DeletionRequestsBlock.vue";
import RoleSelection from "@/views/RoleSelection.vue";

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
      nav: StaffHeader
    }
  },
  {
    path: '/login/role-selection',
    components: {
      default: RoleSelection,
      nav: StaffHeader
    }
  },
  {
    path: '/moderator',
    meta: {
      requiredRole: 'moderator'
    },
    components: {
      default: ModeratorMain,
      nav: StaffHeader,
    },
    children: [{
      path: 'requests',
      component: RequestBlock,
      meta: {
        requiredRole: 'moderator'
      }
    },
    {
      path: 'phrases',
      component: PhraseBlockHolder,
      meta: {
        requiredRole: 'moderator'
      },

    },
    {
      path: 'tags',
      component: TagsPage,
      meta: {
        requiredRole: 'moderator'
      },

    }]
  },
  {
      path: '/moderator/approval/:id',
      components: {
        nav: StaffHeader,
        default: RequestReview
      },
      props:{
        default: true
      },
      meta: {
        requiredRole: 'moderator'
      },
    },
  {
    path: '/admin',
    meta: {
      requiredRole: 'admin'
    },
    components: {
      default: AdministratorMain,
      nav: StaffHeader,
    },
    children: [{
      path: 'staff',
      component: StaffBlock,
      meta: {
        requiredRole: 'admin'
      },
    },
  {
      path: 'deletion-requests',
      component: DeletionRequestsBlock,
      meta: {
        requiredRole: 'admin'
      },
    }]
  },
  {
      path: '/admin/add-moderator',
      components: {
        nav: StaffHeader,
        default: AddModerator
      },
      meta: {
        requiredRole: 'admin'
      },
    },
    {
      path: '/admin/edit-moderator/:id',
      components: {
        nav: StaffHeader,
        default: EditModerator
      },
      props:{
        default: true
      },
      meta: {
        requiredRole: 'admin'
      },
    },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if(to.fullPath === '/moderator'){
    return next('/moderator/requests')
  }
  if(to.fullPath === '/admin'){
    return next('/admin/staff')
  }
  if (to.meta.requiredRole) {
    // window.alert(`${store.getters.role} and ${to.meta.requiredRole}`)
    if (store.getters.role !== to.meta.requiredRole) {
      return next('/login')
    } else {
      return next()
    }
  }
  else {
    return next()
  }
})

export default router;
