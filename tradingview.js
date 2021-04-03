
const { TradingViewAPI }  = require('tradingview-scraper');
const hotSymbol = "HOTUSDT";
const tv = new TradingViewAPI();

tv.getTicker(hotSymbol).then(function (params) {
    console.log(params);
}).catch(e=> console.log(e));