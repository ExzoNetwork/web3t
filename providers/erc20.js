
// Generated by LiveScript 1.6.0
(function(){
  var stringify, ref$, filter, map, foldl, each, plus, minus, times, div, fromHex, $toHex, get, post, Web3, Tx, BN, hdkey, bip39, jsonParse, deadline, sha3, getEthereumFullpairByIndex, abi, getContractInstance, isAddress, getGasEstimate, calcFee, getKeys, toHex, transformTx, up, getTransactions, getWeb3, getDec, calcGasPrice, round, getNonce, createTransaction, checkDecodedData, pushTx, checkTxStatus, getTotalReceived, getUnconfirmedBalance, getBalance, isValidAddress, makeQuery, getTransactionInfo, isChecksumAddress, getMarketHistoryPrices, toString$ = {}.toString, out$ = typeof exports != 'undefined' && exports || this;
  stringify = require('qs').stringify;
  ref$ = require('prelude-ls'), filter = ref$.filter, map = ref$.map, foldl = ref$.foldl, each = ref$.each;
  ref$ = require('../math.js'), plus = ref$.plus, minus = ref$.minus, times = ref$.times, div = ref$.div, fromHex = ref$.fromHex, $toHex = ref$.$toHex;
  ref$ = require('./superagent.js'), get = ref$.get, post = ref$.post;
  ref$ = require('./deps.js'), Web3 = ref$.Web3, Tx = ref$.Tx, BN = ref$.BN, hdkey = ref$.hdkey, bip39 = ref$.bip39;
  jsonParse = require('../json-parse.js');
  deadline = require('../deadline.js');
  sha3 = require('crypto-js/sha3');
  commonProvider = require("./common/provider");
  getEthereumFullpairByIndex = function(mnemonic, index, network){
    var seed, wallet, w, address, privateKey, publicKey;
    seed = bip39.mnemonicToSeed(mnemonic);
    wallet = hdkey.fromMasterSeed(seed);
    w = wallet.derivePath("m/44'/60'/" + index + "'/0/0").getWallet();
    address = "0x" + w.getAddress().toString('hex');
    privateKey = w.getPrivateKeyString();
    publicKey = w.getPublicKeyString();
    return {
      address: address,
      privateKey: privateKey,
      publicKey: publicKey
    };
  };
  getContractInstance = commonProvider.getContractInstanceWithAbi(
    commonProvider.ABI
  );
  isAddress = function(address){
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      return false;
    } else {
      return true;
    }
  };
  getGasEstimate = function(config, cb){
    var network, feeType, account, amount, to, data, gas, dec, from, web3, contract, receiver, val, value, $data, query;
    network = config.network, feeType = config.feeType, account = config.account, amount = config.amount, to = config.to, data = config.data, gas = config.gas;
    if (gas != null) {
      return cb(null, gas);
    }
    dec = getDec(network);
    from = account.address;
    web3 = getWeb3(network);
    contract = getContractInstance(web3, network.address);
    receiver = (function(){
      switch (false) {
      case !(data != null && data !== "0x"):
        return to;
      default:
        return network.address;
      }
    }());
    val = times(amount, dec);
    value = $toHex(val);
    $data = (function(){
      switch (false) {
      case !(data != null && data !== "0x"):
        return data;
      case contract.methods == null:
        return contract.methods.transfer(to, value).encodeABI();
      default:
        return contract.transfer.getData(to, value);
      }
    }());
    query = {
      from: from,
      to: receiver,
      data: $data,
      value: "0x0"
    };
    return makeQuery(network, 'eth_estimateGas', [query], function(err, estimate){
      if (err != null) {
        console.error("[getGasEstimate] error:", err);
      }
      if (err != null) {
        return cb(err);
      }
      return cb(null, fromHex(estimate));
    });
  };
  out$.calcFee = calcFee = function(arg$, cb){
    var network, tx, feeType, account, amount, to, data, gas, gasPrice, web3;
    network = arg$.network, tx = arg$.tx, feeType = arg$.feeType, account = arg$.account, amount = arg$.amount, to = arg$.to, data = arg$.data, gas = arg$.gas, gasPrice = arg$.gasPrice;
    if (feeType !== 'auto') {
      return cb(null);
    }
    web3 = getWeb3(network);
    return calcGasPrice({
      network: network,
      feeType: feeType,
      gasPrice: gasPrice
    }, function(err, gasPrice){
      if (err != null) {
        return cb(err);
      }
      return getGasEstimate({
        network: network,
        feeType: feeType,
        account: account,
        amount: amount,
        to: to,
        data: data,
        gas: gas
      }, function(err, gasEstimate){
        var dec, res, val;
        if (err != null) {
          return cb(null, {
            calcedFee: network.txFee,
            gasPrice: gasPrice
          });
        }
        dec = getDec(network);
        res = times(gasPrice, gasEstimate);
        val = div(res, Math.pow(10, 18));
        return cb(null, {
          calcedFee: val,
          gasPrice: gasPrice,
          gasEstimate: gasEstimate
        });
      });
    });
  };
  out$.getKeys = getKeys = function(arg$, cb){
    var network, mnemonic, index, result;
    network = arg$.network, mnemonic = arg$.mnemonic, index = arg$.index;
    result = getEthereumFullpairByIndex(mnemonic, index, network);
    return cb(null, result);
  };
  toHex = function(it){
    return new BN(it);
  };
  transformTx = curry$(function(network, t){
    var url, FOREIGN_BRIDGE, dec, tx, amount, time, fee, from, txType;
    url = network.api.url;
    FOREIGN_BRIDGE = network.FOREIGN_BRIDGE;
    dec = getDec(network);
    network = 'eth';
    tx = t.hash;
    amount = div(t.value, dec);
    time = t.timeStamp;
    url = url + "/tx/" + tx;
    fee = (function(){
      switch (false) {
      case t.gasUsed == null:
        return div(times(t.gasUsed, t.gasPrice), Math.pow(10, 18));
      default:
        return div(times(t.cumulativeGasUsed, t.gasPrice), Math.pow(10, 18));
      }
    }());
    from = (function(){
      switch (false) {
      default:
        return t.from;
      }
    }());
    txType = (function(){
      switch (false) {
      case up(t.from) !== up(FOREIGN_BRIDGE != null ? FOREIGN_BRIDGE : ""):
        return "EVM → ETHEREUM Swap";
      case up(t.to) !== up(FOREIGN_BRIDGE != null ? FOREIGN_BRIDGE : ""):
        return "ETHEREUM → EVM Swap";
      default:
        return null;
      }
    }());
    return {
      network: network,
      tx: tx,
      amount: amount,
      fee: fee,
      time: time,
      url: url,
      from: from,
      to: t.to,
      txType: txType
    };
  });
  up = function(s){
    return (s != null ? s : "").toUpperCase();
  };
  out$.getTransactions = getTransactions = function(arg$, cb){
    var network, address, token, ref$, ref1$, searchToken, ref2$, apiUrl, apikey, module, action, startblock, endblock, sort, query;
    network = arg$.network, address = arg$.address, token = arg$.token;
    var contractAddress = network.address;
    if (token == null || token.toString().trim().length === 0) {
      console.error("ERC20 provider, [getTransactions] error: token is not defined");
      return cb(null, []);
    }
    if ((network != null ? (ref$ = network.api) != null ? ref$.apikey : void 8 : void 8) == null || (network != null ? (ref1$ = network.api) != null ? ref1$.apikey.toString().trim().length : void 8 : void 8) === 0) {
      console.error("ERC20 provider, [getTransactions] error: apikey is not defined");
      return cb(null, []);
    }
    searchToken = (function(){
      switch (false) {
      case up(token) !== "USDT_ERC20":
        return 'USDT';
      default:
        return token;
      }
    }());
    ref2$ = network.api, apiUrl = ref2$.apiUrl, apikey = ref2$.apikey;
    module = 'account';
    action = 'tokentx';
    startblock = 0;
    endblock = 99999999;
    sort = 'asc';
    query = stringify({
      module: module,
      action: action,
      apikey: apikey,
      address: address,
      sort: sort,
      startblock: startblock,
      endblock: endblock
    });
    return get(apiUrl + "?" + query).timeout({
      deadline: deadline
    }).end(function(err, resp){
      if (err != null) {
        return cb(err);
      }
      return jsonParse(resp.text, function(err, result){
        var txs;
        if (err != null) {
          return cb(err);
        }
        if (toString$.call(result != null ? result.result : void 8).slice(8, -1) !== 'Array') {
          return cb("Unexpected result");
        }
        txs = map(transformTx(network))(
        filter(function(it){
          return up(it.contractAddress) === up(contractAddress);
        })(
        result.result));
        return cb(null, txs);
      });
    });
  };
  getWeb3 = commonProvider.getWeb3;
  getDec = commonProvider.getDec;
  calcGasPrice = function(arg$, cb){
    var network, feeType, gasPrice;
    network = arg$.network, feeType = arg$.feeType, gasPrice = arg$.gasPrice;
    if (gasPrice != null) {
      return cb(null, gasPrice);
    }
    return makeQuery(network, 'eth_gasPrice', [], function(err, price){
      var ref$;
      if (err != null) {
        return cb("calc gas price - err: " + ((ref$ = err.message) != null ? ref$ : err));
      }
      price = fromHex(price);
      return cb(null, price);
    });
  };
  round = function(num){
    return Math.round(+num);
  };
  getNonce = function(arg$, cb){
    var network, account, address;
    network = arg$.network, account = arg$.account;
    address = account.address;
    return makeQuery(network, 'eth_getTransactionCount', [address, 'pending'], function(err, nonce){
      var ref$;
      if (err != null) {
        return cb("cannot get nonce (pending) - err: " + ((ref$ = err.message) != null ? ref$ : err));
      }
      return cb(null, fromHex(nonce));
    });
  };
  out$.createTransaction = createTransaction = curry$(function(arg$, cb){
    var network, account, recipient, amount, amountFee, feeType, txType, data, gas, gasPrice, swap, web3, dec, privateKey;
    network = arg$.network, account = arg$.account, recipient = arg$.recipient, amount = arg$.amount, amountFee = arg$.amountFee, feeType = arg$.feeType, txType = arg$.txType, data = arg$.data, gas = arg$.gas, gasPrice = arg$.gasPrice, swap = arg$.swap;
    if ((network != null ? network.txFeeIn : void 8) == null || (network != null ? network.txFeeIn.toString().trim().length : void 8) === 0) {
      return cb("txFeeIn is not defined for current network");
    }
    if (!isAddress(recipient)) {
      return cb("address in not correct ethereum address");
    }
    web3 = getWeb3(network);
    dec = getDec(network);
    privateKey = new Buffer(account.privateKey.replace(/^0x/, ''), 'hex');
    return getNonce({
      account: account,
      network: network
    }, function(err, nonce){
      var contract, toWei, toWeiEth, toEth, value;
      if (err != null) {
        return cb(err);
      }
      if (nonce == null) {
        return cb("nonce is required");
      }
      contract = getContractInstance(web3, network.address);
      toWei = function(it){
        return times(it, dec);
      };
      toWeiEth = function(it){
        return times(it, Math.pow(10, 18));
      };
      toEth = function(it){
        return div(it, Math.pow(10, 18));
      };
      value = toWei(amount);
      return calcGasPrice({
        network: network,
        feeType: feeType,
        gasPrice: gasPrice
      }, function(err, gasPrice){
        if (err != null) {
          return cb(err);
        }
        return getGasEstimate({
          network: network,
          feeType: feeType,
          account: account,
          amount: amount,
          to: recipient,
          data: data,
          swap: swap
        }, function(err, gasEstimate){
          var onePercent, $gasEstimate, res;
          if (err != null) {
            return cb(err);
          }
          onePercent = times(gasEstimate, "0.01");
          $gasEstimate = plus(gasEstimate, onePercent);
          res = $gasEstimate.split(".");
          $gasEstimate = (function(){
            switch (false) {
            case res.length !== 2:
              return res[0];
            default:
              return $gasEstimate;
            }
          }());
          if (toString$.call(web3.eth.getBalance).slice(8, -1) !== 'Function') {
            return cb("getBalance is not a function");
          }
          return web3.eth.getBalance(account.address, function(err, balance){
            var balanceEth, parentToken;
            if (err != null) {
              return cb(err);
            }
            balanceEth = toEth(balance);
            parentToken = up(network != null ? network.txFeeIn : void 8);
            if (+balanceEth < +amountFee) {
              return cb(parentToken + " balance is not enough to send tx");
            }
            return getBalance({
              network: network,
              address: account.address
            }, function(err, ercBalance){
              if (err != null) {
                return cb(err);
              }
              if (+ercBalance < +amount) {
                return cb("Balance is not enough to send this amount");
              }
              return makeQuery(network, 'eth_chainId', [], function(err, chainId){
                var $data, to, tx, rawtx;
                if (err != null) {
                  return cb(err);
                }
                $data = (function(){
                  switch (false) {
                  case !(data != null && data !== "0x"):
                    return data;
                  case contract.methods == null:
                    return contract.methods.transfer(recipient, value).encodeABI();
                  default:
                    return contract.transfer.getData(recipient, value);
                  }
                }());
                to = (function(){
                  switch (false) {
                  case !(data != null && data !== "0x"):
                    return recipient;
                  default:
                    return network.address;
                  }
                }());
                tx = new Tx({
                  nonce: toHex(nonce),
                  gasPrice: toHex(gasPrice),
                  value: toHex("0"),
                  gas: toHex($gasEstimate),
                  to: to,
                  from: account.address,
                  data: $data || '0x',
                  chainId: chainId
                });
                tx.sign(privateKey);
                rawtx = '0x' + tx.serialize().toString('hex');
                return cb(null, {
                  rawtx: rawtx
                });
              });
            });
          });
        });
      });
    });
  });
  out$.checkDecodedData = checkDecodedData = function(decodedData, data){
    if (!(decodedData != null ? decodedData : "").length === 0) {
      return false;
    }
    if (!(data != null ? data : "").length === 0) {
      return false;
    }
  };
  out$.pushTx = pushTx = curry$(function(arg$, cb){
    var network, rawtx, web3, send, ref$;
    network = arg$.network, rawtx = arg$.rawtx;
    web3 = getWeb3(network);
    send = (ref$ = web3.eth.sendRawTransaction) != null
      ? ref$
      : web3.eth.sendSignedTransaction;
    return send(rawtx, function(err, txid){
      return cb(err, txid);
    });
  });
  out$.checkTxStatus = checkTxStatus = function(arg$, cb){
    var network, tx;
    network = arg$.network, tx = arg$.tx;
    return cb("Not Implemented");
  };
  out$.getTotalReceived = getTotalReceived = function(arg$, cb){
    var address, network;
    address = arg$.address, network = arg$.network;
    return getTransactions({
      address: address,
      network: network
    }, function(err, txs){
      var total;
      total = foldl(plus, 0)(
      map(function(it){
        return it.amount;
      })(
      filter(function(it){
        return it.to.toUpperCase() === address.toUpperCase();
      })(
      txs)));
      return cb(null, total);
    });
  };
  out$.getUnconfirmedBalance = getUnconfirmedBalance = function(arg$, cb){
    var network, address;
    network = arg$.network, address = arg$.address;
    return cb("Not Implemented");
  };
  out$.getBalance = getBalance = commonProvider.getBalance;
  out$.isValidAddress = isValidAddress = function(arg$, cb){
    var address, network, valid;
    address = arg$.address, network = arg$.network;
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      return cb("Address is not valid");
    } else {
      valid = isChecksumAddress(address);
      if (!valid) {
        return cb("Address is not valid");
      }
    }
    return cb(null, true);
  };
  makeQuery = commonProvider.makeQuery;
  out$.getTransactionInfo = getTransactionInfo = function(config, cb){
    var network, tx, query;
    network = config.network, tx = config.tx;
    query = [tx];
    return makeQuery(network, 'eth_getTransactionReceipt', query, function(err, tx){
      var status, result;
      if (err != null) {
        return cb(err);
      }
      status = (function(){
        switch (false) {
        case toString$.call(tx).slice(8, -1) === 'Object':
          return 'pending';
        case tx.status !== '0x0':
          return 'reverted';
        case tx.status !== '0x1':
          return 'confirmed';
        default:
          return 'pending';
        }
      }());
      result = {
        from: tx != null ? tx.from : void 8,
        to: tx != null ? tx.to : void 8,
        status: status,
        info: tx
      };
      return cb(null, result);
    });
  };
  isChecksumAddress = function(address){
    var addressHash, i;
    address = address.replace('0x', '');
    addressHash = sha3(address.toLowerCase());
    i = 0;
    while (i < 40) {
      if (parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i] || parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i]) {
        return false;
      }
      i++;
    }
    return true;
  };
  out$.getMarketHistoryPrices = getMarketHistoryPrices = function(config, cb){
    var network, coin, market;
    network = config.network, coin = config.coin;
    market = coin.market;
    return get(market).timeout({
      deadline: deadline
    }).end(function(err, resp){
      var ref$;
      if (err != null) {
        return cb("cannot execute query - err " + ((ref$ = err.message) != null ? ref$ : err));
      }
      return jsonParse(resp.text, function(err, result){
        if (err != null) {
          return cb(err);
        }
        return cb(null, result);
      });
    });
  };
  function curry$(f, bound){
    var context,
    _curry = function(args) {
      return f.length > 1 ? function(){
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
            f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
    return _curry();
  }
}).call(this);
