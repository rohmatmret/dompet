<template>
  <div class="container">
    {{ JSON.stringify(results) }}
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
const dayjs = require("dayjs");
export default {
  name: "Home",
  data() {
    return {
      showModal: false,
      results: [],
      Form: {},
      current_number:0
    };
  },
  computed: {
    ...mapState({
      items: (state) => state.dompet.items,
      data: (state) => state.dompet.data,
    }),
  },
  mounted() {
    this.actionGetDompet();
  },
  methods: {
    ...mapGetters("dompet", ["dompets"]),
    ...mapActions("dompet", ["fetchDompet"]),
    actionGetDompet() {
      this.fetchDompet();
      let data = this.destructor(this.items);
      data.sort((a, b) => dayjs(b.date) - dayjs(a.date));
      this.results = data;
    },

    destructor(items) {
      let result = [];
      items.forEach((e) => {
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
    formatDate(date) {
      if (date) {
        return dayjs(date).format("DD MMMM");
      }
    },
    formatHours(hours) {
      return dayjs(hours).format("HH:mm");
    },
    showModalAdd() {
      this.showModal = true;
    },
    hideModal() {
      this.showModal = false;
    },
    actionSave() {
      let lastNumber = this.data[this.data.length - 1].id;
      this.current_number += lastNumber
      let payload = {
        id: this.current_number + 1,
        name: this.Form.name,
        cost: this.Form.harga,
        created_at: dayjs().format("YYYY-MM-DD hh:mm:ss"),
      };
      this.current_number

      
      this.updateState(payload);
    },
    sortingDate(arr) {
      arr.sort((a, b) => dayjs(b.date) - dayjs(a.date));
      return arr;
    },
    updateState(items) {
      this.current_number +=1
      const date = dayjs(items.created_at).format("YYYY-MM-DD");
      let manipulation = []
      let get = this.results.find((item) => item?.date === date);
      if (get) {
        get.dompet.push(items);
      } else {
        let h = {
          date: date,
          dompet: [items],
        };
        manipulation.push(h);
        let finished =  [...this.results,...manipulation]
        let finalsort = this.sortingDate(finished)
        this.results = finalsort
      }

      this.hideModal()
      this.Form = {}
    },
  },
};
</script>
<style scoped>
.container {
  font-size: 10px;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}
.modal {
  display: block;
}
</style>
