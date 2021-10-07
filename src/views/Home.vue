<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h4 class="h4 title text-center">Diari Jajan</h4>
        <div class="row justify-content-center font-md">
          <label class="title text-center">
            Total Pengeluaran {{ formatPrice(totalCost) }}
            <br />
            <span> Bulan ini </span> {{ formatPrice(current_cost) }}
          </label>
        </div>
      </div>
      <div class="col-md-12 text-center">
        <button class="btn btn-sm btn-info" @click="showModalAdd">
          Tambah
        </button>
      </div>
    </div>
    <div class="row pt-2">
      <div class="col-md-12">
        <div class="row">
          <div v-for="item in results" :key="item.id" class="col-md-3">
            <div class="card p-1 mb-1">
              <div class="card-title pl-2">
                <b> {{ formatDate(item.date) }} </b>
              </div>
              <table class="table">
                <tbody v-for="detail in item.dompet" :key="detail.id">
                  <tr>
                    <td>{{ formatHours(detail.created_at) }}</td>
                    <td>{{ detail.name }}</td>
                    <td>Rp {{ formatPrice(detail.cost) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2"><b> Total </b></td>
                    <td>Rp {{ formatPrice(ViewCount(item.dompet)) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-12">
        <div class="modal" v-if="showModal">
          <form @submit.prevent="actionSave">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Tambah</h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true" @click="hideModal">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <label for="name">Name</label>
                    <input
                      type="text"
                      v-model="Form.name"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label for="name">Harga</label>
                    <input
                      type="number"
                      v-model="Form.harga"
                      class="form-control"
                      required
                    />
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    @click="actionSave"
                  >
                    Save changes
                  </button>
                  <button
                    @click="hideModal"
                    type="button"
                    class="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
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
      current_number: 0,
      totalCost: 0,
      current_cost: 0,
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
      this.SumtotalCost(this.results);
      this.SumCurrentCost(this.results);
    },
    SumtotalCost(items) {
      let total = 0;
      items.forEach((el) => {
        total += this.ViewCount(el.dompet);
        console.log(total);
      });
      this.totalCost = total;
    },
    SumCurrentCost(items) {
      let curent_month = dayjs().format("YYYY-MM-DD");

      if (items) {
        //  let filtered = items.dompet.map(e => e.date = )
        items.forEach((el) => {
          if (dayjs(el.date).isSame(curent_month, "month")) {
            let costs = el.dompet;
            console.log(`costs ${costs}`);
            if (costs) {
              let c = costs.reduce((prev, cur) => {
                console.log(`prev ${prev} ${cur.cost}`);
                return parseInt(prev) + parseInt(cur.cost);
              }, 0);
              console.log(`hasil ${c}`);
              this.current_cost = c;
            }
          }
        });
      }

      return 0;
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
      this.current_number += lastNumber;
      if (!this.Form || this.Form.name || !this.Form.harga) {
        alert("please fill text");
      } else {
        let payload = {
          id: this.current_number + 1,
          name: this.Form.name,
          cost: this.Form.harga,
          created_at: dayjs().format("YYYY-MM-DD hh:mm:ss"),
        };
        this.current_number;

        this.updateState(payload);
      }
    },
    sortingDate(arr) {
      arr.sort((a, b) => dayjs(b.date) - dayjs(a.date));
      return arr;
    },
    updateState(items) {
      this.current_number += 1;
      const date = dayjs(items.created_at).format("YYYY-MM-DD");
      let manipulation = [];
      let get = this.results.find((item) => item?.date === date);
      if (get) {
        get.dompet.push(items);
      } else {
        let h = {
          date: date,
          dompet: [items],
        };
        manipulation.push(h);
        let finished = [...this.results, ...manipulation];
        let finalsort = this.sortingDate(finished);
        this.results = finalsort;
      }

      this.hideModal();
      this.SumCurrentCost(this.results);
      this.SumtotalCost(this.results);
      this.Form = {};
    },
    ViewCount(items) {
      if (items) {
        return items.reduce((prev, cur) => {
          return parseInt(prev) + parseInt(cur.cost);
        }, 0);
      }

      return 0;
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(0).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
.font-md {
  font-size: 12px;
}
</style>
