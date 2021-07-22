<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <add-ticker @add-ticker="add" :disabled="tooManyCoinsAdded" :double="double"/>
      <template v-if="tickers.length">
        <hr class="w-full border-t border-gray-600 my-4"/>
        <div>
          <button
              v-if="page > 1"
              @click="page--"
              class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Назад
          </button>
          <button
              @click="page++"
              v-if="hasNextPage"
              class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Вперед
          </button>
          <div>Фильтр: <input v-model="filter"/></div>
        </div>


        <hr
            class="w-full border-t border-gray-600 my-4"
        />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
              v-for="t in paginationTickers"
              @click="select(t)"
              :key="t.name"
              :class="{
              'border-2': sel === t
            }"
              class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ t.name }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ t.price }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
                @click.stop="handleDelete(t.name)"
                class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
            >
              <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="#718096"
                  aria-hidden="true"
              >
                <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                ></path>
              </svg>
              Удалить
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4"/>
      </template>
      <section v-if="sel" class="relative">

        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
          {{ sel.name }} - USD
        </h3>
        <div
            ref="graph"
            class="flex items-end border-gray-600 border-b border-l h-64">
          <div
              v-for="(bar, idx) in normalizeGraph"
              :key="idx"
              :style="{
                height: `${bar}%`
              }"
              class="bg-purple-800 border w-10"
          ></div>
        </div>
        <button
            class="absolute top-0 right-0"
        >
          <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="30"
              height="30"
              x="0"
              y="0"
              viewBox="0 0 511.76 511.76"
              style="enable-background:new 0 0 512 512"
              xml:space="preserve"
          >
          <g>
            <path
                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                fill="#718096"
                data-original="#000000"
            ></path>
          </g>
        </svg>
        </button>
      </section>
<!--      <graph-for-crypto-coin :selectTicker="sel" :graph="graph" />-->
    </div>
  </div>

</template>

<script>
import { subscribeToTicker, unsubscribeToTicker, } from "./api";
import AddTicker from "./components/AddTicker.vue";
import GraphForCryptoCoin from "./components/GraphForCryptoCoin.vue";

export default {
  name: 'App',
  components: {
    GraphForCryptoCoin,
    AddTicker
  },


  data() {
    return {
      filter: "",

      tickers: [],
      allCoin: [],
      sel: null,
      double: false,
      page: 1,

      graph: []
    }
  },
  mounted() {
    window.addEventListener('resize', this.calculateMaxGraphEl)
  },
  created() {

    const windowData = Object.fromEntries(
        new URL(window.location).searchParams.entries()
    )

    if (windowData.filter) {
      this.filter = windowData.filter
    }
    if (windowData.page) {
      this.page = windowData.page
    }
    const tickerData = localStorage.getItem('crypto')
    if (tickerData) {
      this.tickers = JSON.parse(tickerData)
      this.tickers.forEach(t => {
        subscribeToTicker(t.name, price => {
          this.upDateTicker(t.name, price)
        })
      })
    }
  },

  computed: {
    tooManyCoinsAdded() {
      return this.tickers.length > 4
    },
    startIndex() {
      return (this.page - 1) * 6
    },
    endIndex() {
      return this.page * 6
    },
    filteredList() {
      return this.tickers.filter(t => t.name.includes(this.filter))
    },
    paginationTickers() {
      return this.filteredList.slice(this.startIndex, this.endIndex)
    },
    hasNextPage() {
      return this.filteredList.length > this.endIndex
    },

    normalizeGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);
      return this.graph.map(
          price => 5 + ((price - minValue) * 95) / (maxValue - minValue)
      );
    },

    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page
      }
    }
  },

  methods: {
    upDateTicker(tickerName, price) {
      this.tickers.filter(t => t.name === tickerName).forEach(t => {
        if (t === this.sel) {
          this.graph.push(price)
          if (this.graph.length > this.maxGraphElements) {
            this.graph.shift()
          }
        }
        t.price = price
      })
    },

    calculateMaxGraphEl() {
      if (!this.$refs.graph) {
        return
      }
      this.maxGraphElements = this.$refs.graph.clientWidth / 38
    },

    add(ticker) {
      const newTickers = {
        name: ticker.toUpperCase(),
        price: "-"
      }
      const index = this.tickers.findIndex(t => t.name === newTickers.name)
      if (index === -1) {
        this.tickers = [...this.tickers, newTickers]
        subscribeToTicker(newTickers.name, newPrice =>
            this.upDateTicker(newTickers.name, newPrice)
        )
        console.log(this.allCoin)
        ticker = ""
        this.double = false
      } else {
        this.double = true
      }
    },
    handleDelete(tickerName) {
      this.tickers = this.tickers.filter(t => t.name !== tickerName)
      unsubscribeToTicker(tickerName)
      this.sel = null
    },

    select(ticker) {
      this.sel = ticker
    }
  },


  watch: {
    tickers() {
      localStorage.setItem('crypto', JSON.stringify(this.tickers))
    },
    sel() {
      this.graph = []
      this.$nextTick(() => {
        this.calculateMaxGraphEl()
      })
    },

    paginationTickers() {
      if (this.paginationTickers.length === 0 && this.page > 1) {
        this.page -= 1
      }
    },

    filter() {
      this.page = 1
      this.filter = this.filter.toUpperCase()
    },
    pageStateOptions(v) {
      window.history.pushState(
          null,
          document.title,
          `${ window.location.pathname }?filter=${ v.filter }&page=${ v.page }`
      )
    }
  }
}


</script>

<style src="./app.css"></style>
