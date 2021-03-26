import data from "../db/data.json";
var dayjs = require("dayjs");
const dompet = {
  namespaced: true,
  state: {
    data: [...data.items],
    items: [],
    item: {},
    totalRows: 0,
    isLoading: false,
  },
  getters: {
    dompet: (state) => state.items,
    dompets: (state) => {
      let result = [];
      state.items.forEach((e) => {
        const date = dayjs(e.created_at).format("YYYY-MM-DD");
        let get = result.find((item) => item?.date === date);
        if (get) {
          get.dompet.push(e);
        } else {
          let h = {
            date: date,
            dompet: [e],
          };
          result.push(h);
        }
      });

      return result;
    },
  },
  actions: {
    fetchDompet({ commit }) {
      try {
        commit("setLoading", true);
        commit("setItems", data.items);
        commit("setRows", data.items.length);
        commit("setLoading", false);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", true);
      }
    },

    storeDompet({ commit }, props) {
      let newItems = [props];
      let result = [...data.items, ...newItems];
      console.table(result);
      commit("setUpdate", result);
    },
  },
  mutations: {
    setItems(state, item) {
      state.items = item;
    },
    setItem(state, item) {
      state.item = item;
    },
    setRows(state, data) {
      state.totalRows = data;
    },
    setLoading(state, data) {
      state.isLoading = data;
    },
    setError(state, data) {
      state.isError = data;
    },
    setUpdate(state, data) {
      state.items = data;
    },
  },
};

export default dompet;
