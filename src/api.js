import axios from "axios";


const tickers = new Map()
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=eee61455ba6ef99a1741c527e93e4bdd2ae9fcb055d4f2a873f95d2416036466`)

const AGGREGATE_INDEX = '5'



socket.addEventListener('message', e => {
  console.log(e)
  const {TYPE: type, FROMSYMBOL: ticker, PRICE: newPrice} = JSON.parse(e.data)
  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return;
  }
  const handlers = tickers.get(ticker) ?? []
  handlers.forEach(fn => fn(newPrice))
})

const senToWebSocket = (message) => {

  const stringifiedMessage = JSON.stringify(message)
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
  }

  socket.addEventListener('open', () => {
    socket.send(stringifiedMessage)
  }, {once: true})
}

const subscribeToTickerOnWb = (ticker) => {

  senToWebSocket({
      action: "SubAdd",
      subs: [`5~CCCAGG~${ ticker }~USD`]
    }
  )
}

const unSubscribeToTickerOnWb = (ticker) => {

  senToWebSocket({
      action: "SubRemove",
      subs: [`5~CCCAGG~${ ticker }~USD`]
    }
  )
}


export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickers.get(ticker) || []
  tickers.set(ticker, [...subscribers, cb])
  subscribeToTickerOnWb(ticker)
}

export const unsubscribeToTicker = (ticker) => {
  tickers.delete(ticker)
  unSubscribeToTickerOnWb(ticker)
}

export const loadTicker = () => {
 return  axios
    .get(`https://min-api.cryptocompare.com/data/blockchain/list?api_key=eee61455ba6ef99a1741c527e93e4bdd2ae9fcb055d4f2a873f95d2416036466`)
    .then(response => {
     return Object.keys(response.data.Data)
    })
}
window.tickers = tickers