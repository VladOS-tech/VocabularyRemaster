import { createStore } from "vuex";
import userStore from "./user-store";
import loginStore from "./login-store";
import staffStore from "./staff-store";
import phraseForm from "./phrase-request-form"
import reviewForm from "./request-review-form"
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
  },
  modules: {
    userStore,
    loginStore,
    staffStore,
    phraseForm: phraseForm,
    reviewForm: reviewForm
  }
});
