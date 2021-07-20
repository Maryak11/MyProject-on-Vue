<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
        >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
              type="text"
              v-model="ticker"
              name="wallet"
              id="wallet"
              class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
              placeholder="Например DOGE"
          />
        </div>
        <div class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
            <span
                v-for="coin in paginationCoins"
                @click="ticker = coin"
                class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
              {{ coin }}
            </span>
        </div>
        <div v-if="double"
             class="text-sm text-red-600"
        >Такой тикер уже добавлен
        </div>
      </div>
    </div>
    <add-button
        @click="add"
        type="button"
        :disabled="disabled"
    />
  </section>
</template>

<script>
import AddButton from "./AddButton.vue";
import axios from "axios";



export default {
  components: {
    AddButton
  },
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    double: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: {
    "add-ticker": value => typeof value === 'string'
  },

  data(){
    return {
      ticker: '',
      allCoins: []
    }
  },
  mounted() {
    axios
        .get(`https://min-api.cryptocompare.com/data/blockchain/list?api_key=eee61455ba6ef99a1741c527e93e4bdd2ae9fcb055d4f2a873f95d2416036466`)
        .then(response => {
          this.allCoins = Object.keys(response.data.Data)
          console.log(this.allCoins)
        })
  },

  computed: {
    filteredCoins() {
      return this.allCoins.filter(coin => coin.includes(this.ticker.toUpperCase()))
    },
    paginationCoins() {
      const startIndexInValid = 0
      const lastIndexInValid = 4
      return this.filteredCoins.slice(startIndexInValid, lastIndexInValid)
    }
  },


  methods:{
    add() {
      if (this.ticker.length === 0){
        return
      }
      this.$emit('add-ticker', this.ticker)
        this.ticker = ""
    },
  }
}
</script>