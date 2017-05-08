import Vue from 'vue'
import Vuex from 'vuex'
import * as type from './mutation-types'

Vue.use(Vuex);

const state = {
  id: '',
  token: '',
  sendMessage: ''
};
const mutations = {
  [type.CHANGE_ID] (state, newValue) {
    state.id = newValue;
  },
  [type.CHANGE_TOKEN] (state, newValue) {
    state.token = newValue;
  },
  [type.CHANGE_SENDMESSAGE] (state, newValue) {
    state.sendMessage = newValue;
  }
};

export default new Vuex.Store({
  state,
  mutations
})
