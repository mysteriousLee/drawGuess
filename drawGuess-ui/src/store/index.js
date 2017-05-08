import Vue from 'vue'
import Vuex from 'vuex'
import * as type from './mutation-types'

Vue.use(Vuex);

const state = {
  id: '',
  token: ''
};
const mutations = {
  [type.CHANGE_ID] (state, newValue) {
    state.id = newValue;
  },
  [type.CHANGE_TOKEN] (state, newValue) {
    state.token = newValue;
  }
};

export default new Vuex.Store({
  state,
  mutations
})
