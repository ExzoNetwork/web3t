// Generated by LiveScript 1.6.0
(function(){
  var mainnet, testnet, color, type, enabled, name, token, image, usdInfo, out$ = typeof exports != 'undefined' && exports || this;
  out$.mainnet = mainnet = {
    decimals: 8,
    txFee: '0.001',
    api: {
      provider: 'velas',
      apiUrl: 'https://oldexplorer.velas.com/api/v1',
      url: 'https://oldexplorer.velas.com',
      historyUrl: 'https://oldexplorer.velas.com/history-api/:address/txs'
    }
  };
  out$.testnet = testnet = {
    decimals: 8,
    txFee: '0.001',
    api: {
      provider: 'velas',
      apiUrl: 'https://testnet.velas.website/api/v1',
      url: 'https://testnet.velas.website',
      historyUrl: 'https://api.velas.website/api/testnet/history_pg/:address?limit=289&offset=0'
    }
  };
  out$.color = color = '#9E4FEB';
  out$.type = type = 'coin';
  out$.enabled = enabled = true;
  out$.name = name = 'Velas Pre-Alpha';
  out$.token = token = 'vlx';
  out$.image = image = "data:image/png;base64,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";
<<<<<<< Updated upstream
  out$.usdInfo = usdInfo = "url(https://explorer.velas.com/ticker).price_usd";
=======
  out$.usdInfo = usdInfo = "url(https://www.bw.com/exchange/config/controller/website/pricecontroller/getassistprice).datas.usd.vlx";
>>>>>>> Stashed changes
}).call(this);
