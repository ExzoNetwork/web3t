// Generated by LiveScript 1.6.0
(function(){
  var mainnet, testnet, color, type, enabled, name, token, nickname, image, usdInfo, out$ = typeof exports != 'undefined' && exports || this;
  out$.mainnet = mainnet = {
    disabled: true,
    decimals: 18,
    txFee: '0.002',
    txFeeOptions: {
      auto: '0.002',
      cheap: '0.002'
    },
    api: {
      provider: 'bnb',
      apiUrl: 'https://api.bscscan.com/api',
      web3Provider: 'https://explorer.velas.com/rpc',
      url: 'https://explorer.velas.com'
    }
  };
  out$.testnet = testnet = {
    disabled: false,
    decimals: 18,
    txFee: '0.000001',
    txFeeOptions: {
      auto: '0.000020',
      cheap: '0.000020'
    },
    api: {
      provider: 'bnb',
      web3Provider: 'https://data-seed-prebsc-1-s2.binance.org:8545',
      url: 'https://testnet.bscscan.com',
      apiUrl: 'https://api-testnet.bscscan.com/api'
    }
  };
  out$.color = color = '#9E4FEB';
  out$.type = type = 'coin';
  out$.enabled = enabled = true;
  out$.name = name = 'Binance Coin';
  out$.token = token = 'bnb';
  out$.nickname = nickname = 'bnb';
  out$.image = image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAADAFBMVEVHcEzyui/zuS7yuS7//xfufw3zui75/wDyuS//rT3yui/yvjPWcw3oAADrsDHyuS7/vz/yuS/ZfzDzui/ttS7xuS7zui/0vTDzui7zui/suC7yuS7zui6/vzv1uS/zsjPusy7wuTD3vTDzuS7zuS71uy/0ui7xuS70ui/zuS7wty/0ui/1uy/vtyvyuC7yuS3vuC3zui/0ui72vS/zuy7yuS3yuS30ui7zvC/yuS7zui7yuS7zuy7xuC7yuS7yuS7zui70ui70uy/xuS70ui7zui7yui70ui72vS/zuS/0ui/zuy7yui7zuS7xuS3yuS7xuS3zuS3zuy7zui72vC7zuy71uS7wuC75vi/zui7zui/yuS/0ui/yui7xui7vuy3zuy73uzH0uy/0ujDyuS/xuC31uzD3vS/xtzH4vS/0ui3zui7zuy7zui30uy70ui70ui7zuS7xty/0uy/wuC7zuy/yuS/zuS/zuy/3vi/3wDD1szD4vzDzui7zui/utS77wzH5vy/yui7zuC/5xDH2vC78wjD7xTH7xDHxty31vC/uuS71tS7zui/////zujD///7//vzzuzHzuCnztybzuzL30XP0uy///v3zuzP//vv///330HPztyf3vDDzujH0xEz1xEvzuCjzuSz++e78wDD8wTD/xDH1xlD0vjz+9uP2vC/++vD5vzD3vTD+9uLzuSrzuCbztyj1xlHzuS387szzuCr0ui/7wDD/xTL1xE30vzz+wzH0wED989z6vzD1uy/++vH++ezzuCv//PP0wEH1xU/99d/99Nz878/30HLyuCfzvDPzui3ztyX++/L99eD+9N787sr//frzuSv1xFD/yDL/yzP/xjL+9+P99uH0vz78783yuCn0wUH+wjH++Ob88ND98M/1xU7+9+X9wjH4vjD98dP0w0v///z99Nv/xzL/yTL99N7/xTH98ND2vDD30HT30XTzvDT9xDH0wUX98dL98tf87cn30XX++O330HH++/PyuSr+xDH989gh6Ej4AAAAn3RSTlMA/fv8AgL8Af4D/gYDAQX6BP0E/RL9+Qjjwgvh+wQfChwUs8B1/o9l/k4v9Bgbp5E6+IL99S2phmbV0OcdQihxnTOnoMuvle3xN4C0+56K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";
  out$.usdInfo = usdInfo = "url(https://explorer.velas.com/ticker).price_usd";
}).call(this);
