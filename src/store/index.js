import Vue from "vue";
import Vuex from "vuex";

import dompet from "./dompet.js";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    dompet: dompet,
  },
  strict: "development",
});
