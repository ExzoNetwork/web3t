
// Generated by LiveScript 1.6.0
(function(){
  var stringify, ref$, filter, map, foldl, each, sortBy, reverse, plus, minus, times, div, fromHex, $toHex, get, post, Web3, Tx, BN, hdkey, bip39, jsonParse, deadline, decode, encode, Common, xzoToEth, ethToVlx, sha3, isChecksumAddress, isAddress, toEthAddress, isValidAddress, getEthereumFullpairByIndex, tryParse, makeQuery, getTransactionInfo, getGasEstimate, calcFee, getKeys, round, toHex, transformTx, getInternalTransactions, getExternalTransactions, getTransactions, getDec, calcGasPrice, tryGetLatest, getNonce, createTransaction, checkDecodedData, pushTx, checkTxStatus, getTotalReceived, getUnconfirmedBalance, getBalance, getSyncStatus, getPeerCount, getMarketHistoryPrices, toString$ = {}.toString, out$ = typeof exports != 'undefined' && exports || this;
  stringify = require('qs').stringify;
  ref$ = require('prelude-ls'), filter = ref$.filter, map = ref$.map, foldl = ref$.foldl, each = ref$.each, sortBy = ref$.sortBy, reverse = ref$.reverse;
  ref$ = require('../math.js'), plus = ref$.plus, minus = ref$.minus, times = ref$.times, div = ref$.div, fromHex = ref$.fromHex, $toHex = ref$.$toHex;
  ref$ = require('./superagent.js'), get = ref$.get, post = ref$.post;
  ref$ = require('./deps.js'), Web3 = ref$.Web3, Tx = ref$.Tx, BN = ref$.BN, hdkey = ref$.hdkey, bip39 = ref$.bip39;
  jsonParse = require('../json-parse.js');
  deadline = require('../deadline.js');
  ref$ = require('bs58'), decode = ref$.decode, encode = ref$.encode;
  Common = require('ethereumjs-common')['default'];
  ref$ = require('../addresses.js'), xzoToEth = ref$.xzoToEth, ethToVlx = ref$.ethToVlx;
  sha3 = require('crypto-js/sha3');
  commonProvider = require("./common/provider");
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
  isAddress = function(address){
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      return false;
    } else {
      if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        return true;
      } else {
        return isChecksumAddress(address);
      }
    }
  };
  toEthAddress = function(exzoAddress, cb){
    var res, err;
    if (toString$.call(exzoAddress).slice(8, -1) !== 'String') {
      return cb("required exzo-address as a string");
    }
    if (isAddress(exzoAddress)) {
      return cb(null, exzoAddress);
    }
    if (exzoAddress[0] !== 'V') {
      return cb("exzo address can be started with V");
    }
    res = null;
    try {
      res = xzoToEth(exzoAddress);
    } catch (e$) {
      err = e$;
      return cb(err);
    }
    return cb(null, res);
  };
  if (typeof window != 'undefined' && window !== null) {
    if (typeof window != 'undefined' && window !== null) {
      window.toEthAddress = xzoToEth;
    }
  }
  out$.isValidAddress = isValidAddress = function(arg$, cb){
    var address;
    address = arg$.address;
    return toEthAddress(address, function(err){
      if (err != null) {
        return cb("Given address is not valid Exzo address");
      }
      return cb(null, true);
    });
  };
  getEthereumFullpairByIndex = function(mnemonic, index, network){
    var seed, wallet, w, address, privateKey, publicKey;
    seed = bip39.mnemonicToSeed(mnemonic);
    wallet = hdkey.fromMasterSeed(seed);
    w = wallet.derivePath("m/44'/5655640'/" + index + "'/0/0").getWallet();
    address = '0x' + w.getAddress().toString('hex');
    privateKey = w.getPrivateKeyString();
    publicKey = w.getPublicKeyString();
    return {
      address: address,
      privateKey: privateKey,
      publicKey: publicKey
    };
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
  getGasEstimate = function(config, cb){
    var network, feeType, account, amount, to, data, dec, from, val, value, $data, query;
    network = config.network, feeType = config.feeType, account = config.account, amount = config.amount, to = config.to, data = config.data;
    if (+amount === 0) {
      return cb(null, "0");
    }
    dec = getDec(network);
    from = config.account.address;
    val = times(amount, dec);
    value = $toHex(val);
    $data = (function(){
      switch (false) {
      case data != null:
        return "0x";
      case !(data != null && data !== "0x"):
        return data;
      default:
        return data;
      }
    }());
    query = {
      from: from,
      to: to,
      data: $data,
      value: value
    };
    return makeQuery(network, 'eth_estimateGas', [query], function(err, estimate){
      if (err != null) {
        console.error("[getGasEstimate] error:", err);
      }
      if (err != null) {
        return cb(null, "1000000");
      }
      return cb(null, fromHex(estimate));
    });
  };
  out$.calcFee = calcFee = function(arg$, cb){
    var network, feeType, account, amount, to, data, gasPrice, gas, dec;
    network = arg$.network, feeType = arg$.feeType, account = arg$.account, amount = arg$.amount, to = arg$.to, data = arg$.data, gasPrice = arg$.gasPrice, gas = arg$.gas;
    if (feeType !== 'auto') {
      return cb(null);
    }
    dec = getDec(network);
    return calcGasPrice({
      feeType: feeType,
      network: network,
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
      }, function(err, estimate){
        var res, val;
        if (err != null) {
          return cb(null, {
            calcedFee: network.txFee,
            gasPrice: gasPrice
          });
        }
        res = times(gasPrice, estimate);
        val = div(res, dec);
        return cb(null, {
          calcedFee: val,
          gasPrice: gasPrice,
          gasEstimate: estimate
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
  round = function(num){
    return Math.round(+num);
  };
  toHex = function(it){
    return new BN(it);
  };
  transformTx = curry$(function(network, description, t){
    var url, dec, tx, amount, time, gasUsed, gasPrice, fee, recipientType, ref$, res;
    url = network.api.url;
    dec = getDec(network);
    network = 'eth';
    tx = (function(){
      switch (false) {
      case t.hash == null:
        return t.hash;
      case t.transactionHash == null:
        return t.transactionHash;
      default:
        return "unknown";
      }
    }());
    amount = div(t.value, dec);
    time = t.timeStamp;
    url = url + "/tx/" + tx;
    gasUsed = (function(){
      switch (false) {
      case t.gasUsed == null:
        return t.gasUsed;
      case t.gasUsed + "".length !== 0:
        return "0";
      default:
        return "0";
      }
    }());
    gasPrice = (function(){
      switch (false) {
      case t.gasPrice == null:
        return t.gasPrice;
      case t.gasPrice + "".length !== 0:
        return "0";
      default:
        return "0";
      }
    }());
    fee = div(times(gasUsed, gasPrice + ""), dec);
    recipientType = ((ref$ = t.input) != null ? ref$ : "").length > 3 ? 'contract' : 'regular';
    res = {
      network: network,
      tx: tx,
      amount: amount,
      fee: fee,
      time: time,
      url: url,
      from: t.from,
      to: t.to,
      recipientType: recipientType,
      description: description
    };
    return res;
  });
  getInternalTransactions = function(config, cb){
    var network, address, apiUrl, module, action, startblock, endblock, sort, apikey, page, offset, query;
    network = config.network, address = config.address;
    apiUrl = config.network.api.apiUrl;
    module = 'account';
    action = 'txlistinternal';
    startblock = 0;
    endblock = 99999999;
    sort = 'desc';
    apikey = '4TNDAGS373T78YJDYBFH32ADXPVRMXZEIG';
    page = config.page;
    offset = config.offset;
    query = stringify({
      module: module,
      action: action,
      apikey: apikey,
      address: address,
      page,
      offset,
    });
    return get(apiUrl + "?" + query).timeout({
      deadline: deadline
    }).end(function(err, resp){
      var ref$;
      if (err != null) {
        return cb("cannot execute query - err " + ((ref$ = err.message) != null ? ref$ : err));
      }
      return jsonParse(resp.text, function(err, result){
        var ref$, txs;
        if (err != null) {
          return cb("cannot parse json: " + ((ref$ = err.message) != null ? ref$ : err));
        }
        if (toString$.call(result != null ? result.result : void 8).slice(8, -1) !== 'Array') {
          return cb("Unexpected result");
        }
        txs = map(transformTx(network, 'internal'))(
        result.result);
        return cb(null, txs);
      });
    });
  };
  getExternalTransactions = function(arg$, cb){
    var network, address, apiUrl, module, action, startblock, endblock, page, offset, sort, apikey, query;
    network = arg$.network, address = arg$.address;
    apiUrl = network.api.apiUrl;
    module = 'account';
    action = 'txlist';
    startblock = 0;
    endblock = 99999999;
    page = arg$.page;
    offset = arg$.offset;
    sort = 'desc';
    apikey = '4TNDAGS373T78YJDYBFH32ADXPVRMXZEIG';
    query = stringify({
      module: module,
      action: action,
      apikey: apikey,
      address: address,
      page,
      offset,
    });
    return get(apiUrl + "?" + query).timeout({
      deadline: deadline
    }).end(function(err, resp){
      var ref$;
      if (err != null) {
        return cb("cannot execute query - err " + ((ref$ = err.message) != null ? ref$ : err));
      }
      return jsonParse(resp.text, function(err, result){
        var ref$, txs;
        if (err != null) {
          return cb("cannot parse json: " + ((ref$ = err.message) != null ? ref$ : err));
        }
        if (toString$.call(result != null ? result.result : void 8).slice(8, -1) !== 'Array') {
          return cb("Unexpected result");
        }
        txs = map(transformTx(network, 'external'))(
        result.result);
        return cb(null, txs);
      });
    });
  };
  out$.getTransactions = getTransactions = function(arg$, cb){
    var network, address, page, offset;
    network = arg$.network, address = arg$.address;
    page = 1;
    offset = 20;
    return getExternalTransactions({
      network: network,
      address: address,
      page: page,
      offset: offset
    }, function(err, external){
      if (err != null) {
        return cb(err);
      }
      return getInternalTransactions({
        network: network,
        address: address,
        page: page,
        offset: offset
      }, function(err, internal){
        var all, ordered;
        if (err != null) {
          return cb(err);
        }
        all = external.concat(internal);
        ordered = reverse(
        sortBy(function(it){
          return it.time;
        })(
        all));
        return cb(null, ordered);
      });
    });
  };
  getDec = commonProvider.getDec;
  calcGasPrice = function(arg$, cb){
    var feeType, network, gasPrice;
    feeType = arg$.feeType, network = arg$.network, gasPrice = arg$.gasPrice;
    if (gasPrice != null) {
      return cb(null, gasPrice);
    }
    if (feeType === 'cheap') {
      return cb(null, 22000);
    }
    return makeQuery(network, 'eth_gasPrice', [], function(err, price){
      var ref$;
      if (err != null) {
        return cb("calc gas price - err: " + ((ref$ = err.message) != null ? ref$ : err));
      }
      price = fromHex(price);
      if (+price < 22000) {
        return cb(null, 22000);
      }
      return cb(null, price);
    });
  };
  tryGetLatest = function(arg$, cb){
    var network, account;
    network = arg$.network, account = arg$.account;
    return toEthAddress(account.address, function(err, address){
      if (err != null) {
        return cb(err);
      }
      return makeQuery(network, 'eth_getTransactionCount', [address, "latest"], function(err, nonce){
        var ref$, next;
        if (err != null) {
          return cb("cannot get nonce (latest) - err: " + ((ref$ = err.message) != null ? ref$ : err));
        }
        next = +fromHex(nonce);
        return cb(null, next);
      });
    });
  };
  getNonce = function(arg$, cb){
    var network, account;
    network = arg$.network, account = arg$.account;
    return toEthAddress(account.address, function(err, address){
      if (err != null) {
        return cb(err);
      }
      return makeQuery(network, 'eth_getTransactionCount', [address, 'pending'], function(err, nonce){
        var ref$;
        if (err != null && (((ref$ = err.message) != null ? ref$ : err) + "").indexOf('not implemented') > -1) {
          return tryGetLatest({
            network: network,
            account: account
          }, cb);
        }
        if (err != null) {
          return cb("cannot get nonce (pending) - err: " + ((ref$ = err.message) != null ? ref$ : err));
        }
        return cb(null, fromHex(nonce));
      });
    });
  };
  isAddress = function(address){
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      return false;
    } else {
      return true;
    }
  };
  out$.createTransaction = createTransaction = curry$(function(arg$, cb){
    var network, account, recipient, amount, amountFee, data, feeType, txType, gasPrice, gas, dec;
    network = arg$.network, account = arg$.account, recipient = arg$.recipient, amount = arg$.amount, amountFee = arg$.amountFee, data = arg$.data, feeType = arg$.feeType, txType = arg$.txType, gasPrice = arg$.gasPrice, gas = arg$.gas;
    dec = getDec(network);
    return toEthAddress(recipient, function(err, $recipient){
      var privateKey;
      if (err != null) {
        return cb(err);
      }
      if (!isAddress($recipient)) {
        return cb("address is not correct ethereum address");
      }
      privateKey = new Buffer(account.privateKey.replace(/^0x/, ''), 'hex');
      return getNonce({
        account: account,
        network: network
      }, function(err, nonce){
        var toWei, toEth, value, buffer;
        if (err != null) {
          return cb(err);
        }
        toWei = function(it){
          return times(it, dec);
        };
        toEth = function(it){
          return div(it, dec);
        };
        value = toWei(amount);
        buffer = {};
        return calcGasPrice({
          feeType: feeType,
          network: network,
          gasPrice: gasPrice
        }, function(err, gasPrice){
          if (err != null) {
            return cb(err);
          }
          buffer.gasPrice = gasPrice;
          return toEthAddress(account.address, function(err, address){
            if (err != null) {
              return cb(err);
            }
            return makeQuery(network, 'eth_getBalance', [address, 'latest'], function(err, balance){
              var balanceEth, toSend, dataParsed;
              if (err != null) {
                return cb(err);
              }
              balanceEth = toEth(balance);
              toSend = plus(amount, amountFee);
              if (+balanceEth < +toSend) {
                return cb("Balance " + balanceEth + " is not enough to send tx " + toSend);
              }
              dataParsed = (function(){
                switch (false) {
                case data == null:
                  return data;
                default:
                  return '0x';
                }
              }());
              return getGasEstimate({
                network: network,
                feeType: feeType,
                account: account,
                amount: amount,
                to: recipient,
                data: data
              }, function(err, gasEstimate){
                if (err != null) {
                  return cb(err);
                }
                return makeQuery(network, 'eth_chainId', [], function(err, chainId){
                  if (err != null) {
                    return cb(err);
                  }
                  return makeQuery(network, 'net_version', [], function(err, networkId){
                    var common, gasPrice, txObj, tx, rawtx;
                    if (err != null) {
                      return cb(err);
                    }
                    common = Common.forCustomChain('mainnet', {
                      networkId: networkId
                    });
                    gasPrice = buffer.gasPrice;
                    if (feeType === 'custom' || !gasPrice) {
                      gasPrice = div(times(amountFee, dec), gasEstimate);
                    }
                    txObj = {
                      nonce: toHex(nonce),
                      gasPrice: toHex(gasPrice),
                      value: toHex(value),
                      gas: toHex(gasEstimate),
                      to: $recipient,
                      from: address,
                      data: data || "0x",
                      chainId: chainId
                    };
                    tx = new Tx(txObj, {
                      common: common
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
    var network, rawtx;
    network = arg$.network, rawtx = arg$.rawtx;
    return makeQuery(network, 'eth_sendRawTransaction', [rawtx], function(err, txid){
      var ref$;
      if (err != null) {
        return cb("cannot get signed tx - err: " + ((ref$ = err.message) != null ? ref$ : err));
      }
      return cb(null, txid);
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
      var address, total;
      if (err != null) {
        return cb(err);
      }
      address = account.address;
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
    return makeQuery(network, 'eth_getBalance', [address, 'pending'], function(err, number){
      var dec, balance;
      if (err != null) {
        return cb(err);
      }
      dec = getDec(network);
      balance = div(number, dec);
      return cb(null, balance);
    });
  };
  out$.getBalance = getBalance = function(arg$, cb){
    var network, address;
    network = arg$.network, address = arg$.address;
    return makeQuery(network, 'eth_getBalance', [address, 'latest'], function(err, number){
      var dec, balance;
      if (err != null) {
        return cb(err);
      }
      dec = getDec(network);
      balance = div(number, dec);
      return cb(null, balance);
    });
  };
  out$.getSyncStatus = getSyncStatus = function(arg$, cb){
    var network;
    network = arg$.network;
    return makeQuery(network, 'eth_getSyncing', [], function(err, estimate){
      if (err != null) {
        return cb(err);
      }
      return cb(null, estimate);
    });
  };
  out$.getPeerCount = getPeerCount = function(arg$, cb){
    var network;
    network = arg$.network;
    return makeQuery(network, 'net_getPeerCount', [], function(err, estimate){
      if (err != null) {
        return cb(err);
      }
      return cb(null, estimate);
    });
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
