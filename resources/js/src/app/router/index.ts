import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import UserHeader from "@/widgets/Header/UserHeader";
import PhrasesPage from "@/pages/UserPages/PhrasesPage";
import AddPhrasePage from "@/pages/UserPages/AddPhrasePage";
import StaffHeader from "@/widgets/Header/UserHeader";
import LoginPage from "@/pages/LoginPage";
import ModeratorMain from "@/pages/ModeratorPages/ModeratorMain";
import RequestBlock from "@/widgets/Moderator/Blocks/RequestBlock";
import PhraseBlockHolder from "@/widgets/Moderator/Blocks/PhraseBlockHolder";
import AdministratorMain from "@/pages/AdminPages/AdministratorMain";
import StaffBlock from "@/widgets/Administrator/Blocks/StaffBlock";
import TagsPage from "@/widgets/Moderator/Blocks/TagsPage";
import store from "../store";
import RequestReview from "@/pages/ModeratorPages/RequestReview";
import AddModerator from "@/pages/AdminPages/AddModerator";
import EditModerator from "@/pages/AdminPages/EditModerator";
import DeletionRequestsBlock from "@/widgets/Administrator/Blocks/DeletionRequestBlock";
import RoleSelection from "@/pages/RoleSelection";

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
