import { createStore } from "vuex";
import userStore from "./user-store";
import loginStore from "./login-store";
import staffStore from "./staff-store";
import phraseForm from "./phrase-request-form"
// ------------

export default createStore({
  state: {
    pageName: '' as string,
    token: '' as string,
    role: 'user' as string,
    username: '' as string
  },
  getters: {
    pageName(state) {
      return state.pageName;
    },
    role(state){
      return state.role
    },
    username(state){
      return state.username
    },
    token(state){
      return state.token
    }
  },
  mutations: {
    setPageName(state, name: string) {
      state.pageName = name;
    },
    setUserRole(state, role: string) {
      state.role = role;
    },
    setUsername(state, name: string) {
      state.username = name;
    },
    setToken(state, token: string) {
      state.token = token;
    }
  },
  modules: {
    userStore,
    loginStore,
    staffStore,
    phraseForm: phraseForm
  }
});
