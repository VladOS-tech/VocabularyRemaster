import { createStore } from "vuex";
import userStore from "@/entities/user/model/user-store";
import loginStore from "@/features/auth";
import staffStore from "@/entities/moderator/model/staff-store";
import phraseForm from "@/entities/user/model/phrase-request-form"
import reviewForm from "@/entities/moderator/model/request-review-form";
import addModeratorForm from "@/entities/admin/model/add-moderator-form";
import editModeratorForm from "@/entities/admin/model/edit-moderator-form";
// ------------

export default createStore({
  state: {
    pageName: '' as string
  },
  getters: {
    pageName(state) {
      return state.pageName;
    }
  },
  mutations: {
    setPageName(state, name: string) {
      state.pageName = name;
    },
    setMobile(state){
      null
    }
  },
  modules: {
    userStore,
    loginStore,
    staffStore,
    phraseForm: phraseForm,
    reviewForm: reviewForm,
    addModeratorForm: addModeratorForm,
    editModeratorForm: editModeratorForm
  }
});
