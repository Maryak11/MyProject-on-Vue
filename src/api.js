const tickers = new Map()

export const LoadTicker = () => {
  if (tickers.size === 0) {
    return
  }
  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${ [
      ...tickers.keys()].join(
      ','
    ) }&tsyms=USD&api_key=5e9a4d78aa05677fa4b3a6805bc0bbafdb3c521f1a061beb4ccd60a3bdce615d`
  ).then(r => r.json())
    .then(rawData => {
        const updatePrices = Object.fromEntries(
          Object.entries(rawData).map(([key, value]) => [key, value.USD])
        )
        console.log(updatePrices, 'cdsc', Object.entries(updatePrices))

        Object.entries(updatePrices).forEach(([cur, newPrice]) => {
          const handlers = tickers.get(cur) ?? []
          handlers.forEach(fn => fn(newPrice))
        })
      }
    )

}


export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickers.get(ticker) || []
  tickers.set(ticker, [...subscribers, cb])
}

export const unsubscribeToTicker = (ticker) => {
  tickers.delete(ticker)
}

setInterval(LoadTicker, 5000)
window.tickers = tickers