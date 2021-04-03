const Binance = require('node-binance-api');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000 ;

app.use(bodyParser.urlencoded({
    extended: true
  }));

  process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
  });

app.use(bodyParser.text({type: '*/*'}));
require('dotenv').config()

const binance = new Binance().options({
  APIKEY: process.env.APIKEY,
  APISECRET: process.env.APISECRET
});

app.post('/alert', async(req,res) => {
    const pair = 'HOTUSDT';
    if(req.body == "buy"){
        binance.balance((error, balances) => {
            if ( error ) return console.error(error);
            let balance = {},response = {};
            balance.USDT = balances.USDT.available;
            balance.HOT = balances.HOT.available;
            response.balance = balance;
    
            binance.prices(pair, (error, ticker) => {
                response.canBuyAmount =  Math.floor((balance.USDT / ticker.HOTUSDT)*0.50);
                response.HotPrice = ticker.HOTUSDT;
                binance.marketBuy(pair, response.canBuyAmount);
                console.log(response);
                res.send(response);
            });
        });

    }else if(req.body == "sell"){
        binance.balance((error, balances) => {
            if ( error ) return console.error(error);
            let balance = {},response = {};
            balance.USDT = balances.USDT.available;
            balance.HOT = balances.HOT.available;
            response.balance = balance;
    
            binance.prices(pair, (error, ticker) => {
                response.canSellAmount = balance.HOT;
                response.HotPrice = ticker.HOTUSDT;
                binance.marketSell(pair, response.canSellAmount);
                console.log(response);
                res.send(response);
            });
        });
    }else{

        res.send('OK');
    }
});

app.get('/alert',async (req, res) =>  {
    const pair = 'HOTUSDT';

    binance.balance((error, balances) => {
        if ( error ) return console.error(error);
        let balance = {},response = {};
        balance.USDT = balances.USDT.available;
        balance.HOT = balances.HOT.available;
        response.balance = balance;

        binance.prices(pair, (error, ticker) => {
            response.canBuyAmount =  Math.floor(balance.USDT / ticker.HOTUSDT) * 0.5;
            response.HotPrice = ticker.HOTUSDT;
            res.send(response);
        });
    });



})




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})




// (addEventsAndStuff = async function(){
//     binance.balance((error, balances) => {
//         if ( error ) return console.error(error);
//         let currUSDTBalance = balances.USDT.available;
//         let currHOTBalance = balances.HOT.available;
//         console.info("Tether balance: ", currUSDTBalance);
//         console.info("HOT balance: ", currHOTBalance);
//         let canBuyAmount = 0,canSellAmount = 0;
//         console.log("-------------------------------------------");

//         binance.prices('HOTUSDT', (error, ticker) => {
//             console.info("Price of HOT: ", ticker.HOTUSDT);
//             canBuyAmount =  Math.floor(currUSDTBalance / ticker.HOTUSDT);
//             console.info('You can buy: ',canBuyAmount,'HOT');
//         });
//         binance.prices('HOTUSDT', (error, ticker) => {
//             console.info("Price of HOT: ", ticker.HOTUSDT);
//             canSellAmount =  Math.floor(currHOTBalance);
//             console.info('You can sell: ',canSellAmount,'HOT');
//         });


//     });

//     // These orders will be executed at current market price.
//     // let quantity = 1;
//     // binance.marketBuy("BNBBTC", quantity);
//     // binance.marketSell("ETHBTC", quantity);
    
// })();
    
    
// binance.prices('HOTUSDT', (error, ticker) => {
//     console.info("Price of HOT: ", ticker.HOTUSDT);
// });
// binance.balance((error, balances) => {
//     // if ( error ) return console.error(error);
//     console.info("balances()", balances);
//     console.info("ETH balance: ", balances.ETH.available);
//   });
// binance.bookTickers('HOTUSDT', (error, ticker) => {
//     console.table( ticker);
// });


// binance.trades("HOTUSDT", (error, trades, symbol) => {
//     console.info(symbol+" trade history", trades);
//   });
// binance.websockets.chart("HOTUSDT", "1m", (symbol, interval, chart) => {
//     let tick = binance.last(chart);
//     const last = chart[tick].close;
//     // console.info(chart);
//     // Optionally convert 'chart' object to array:
//     // let ohlc = binance.ohlc(chart);
//     // console.info(symbol, ohlc);
//     console.info(symbol+" last price: "+last)
//   });
