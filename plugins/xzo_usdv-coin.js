// Generated by LiveScript 1.6.0
(function(){
  var mainnet, testnet, color, type, enabled, name, token, nickname, image, usdInfo, out$ = typeof exports != 'undefined' && exports || this;
  out$.mainnet = mainnet = {
    disabled: false,
    decimals: 18,
    txFee: '0.002',
    txFeeOptions: {
      auto: '0.002',
      cheap: '0.002'
    },
    api: {
      provider: 'exzo_usdv',
      apiUrl: 'https://evmexplorer.velas.com/api',
      web3Provider: "https://evmexplorer.velas.com/rpc",
      url: 'https://evmexplorer.velas.com'
    },
    group: "Exzo",
    address: "0xcD7509b76281223f5B7d3aD5d47F8D7Aa5C2B9bf",
    txFeeIn: "xzo_evm",
    txBridgeFeeIn: "xzo_evm",

  };
  out$.testnet = testnet = {
    disabled: true,
  };
  out$.color = color = '#9E4FEB';
  out$.type = type = 'coin';
  out$.enabled = enabled = true;
  out$.name = name = 'USD Velero';
  out$.token = token = 'xzo_usdv';
  out$.nickname = nickname = 'usdv';
  out$.image = image = "data:image/png;base64,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";
  out$.usdInfo = usdInfo = "url(https://explorer.velas.com/ticker).usdv_price";
}).call(this);
