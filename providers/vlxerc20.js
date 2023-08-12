// Generated by LiveScript 1.6.0
(function(){
  var stringify, ref$, filter, map, foldl, each, plus, minus, times, div, get, Web3, Tx, BN, hdkey, bip39, ethToVlx, xzoToEth, jsonParse, deadline, sha3, getEthereumFullpairByIndex, abi, getContractInstance, isAddress, calcFee, getKeys, toHex, transformTx, up, getTransactions, getWeb3, getDec, calcGasPrice, round, createTransaction, checkDecodedData, pushTx, checkTxStatus, getTotalReceived, getUnconfirmedBalance, getBalance, isValidAddress, isChecksumAddress, toString$ = {}.toString, out$ = typeof exports != 'undefined' && exports || this;
  stringify = require('qs').stringify;
  ref$ = require('prelude-ls'), filter = ref$.filter, map = ref$.map, foldl = ref$.foldl, each = ref$.each;
  ref$ = require('../math.js'), plus = ref$.plus, minus = ref$.minus, times = ref$.times, div = ref$.div;
  get = require('./superagent.js').get;
  ref$ = require('./deps.js'), Web3 = ref$.Web3, Tx = ref$.Tx, BN = ref$.BN, hdkey = ref$.hdkey, bip39 = ref$.bip39;
  ref$ = require('../addresses.js'), ethToVlx = ref$.ethToVlx, xzoToEth = ref$.xzoToEth;
  jsonParse = require('../json-parse.js');
  deadline = require('../deadline.js');
  sha3 = require('crypto-js/sha3');
  commonProvider = require("./common/provider");
  getEthereumFullpairByIndex = function(mnemonic, index, network){
    var seed, wallet, w, address, privateKey, publicKey;
    seed = bip39.mnemonicToSeed(mnemonic);
    wallet = hdkey.fromMasterSeed(seed);
    w = wallet.derivePath("m0").deriveChild(index).getWallet();
    address = ethToVlx("0x" + w.getAddress().toString('hex'));
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
    if (address.startsWith('V')) {
      address = xzoToEth(address);
    }
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      return false;
    } else {
      return true;
    }
  };
  out$.calcFee = calcFee = function(arg$, cb){
    var network, tx, feeType, account, amount, to, data, web3;
    network = arg$.network, tx = arg$.tx, feeType = arg$.feeType, account = arg$.account, amount = arg$.amount, to = arg$.to, data = arg$.data;
    if (feeType !== 'auto') {
      return cb(null);
    }
    web3 = getWeb3(network);
    return calcGasPrice({
      web3: web3,
      feeType: feeType
    }, function(err, gasPrice){
      var from, to;
      if (err != null) {
        return cb(err);
      }
      from = account.address;
      if (to != null && to.startsWith('V')) {
        to = xzoToEth(to);
      }
      if (from != null && from.startsWith('V')) {
        from = xzoToEth(from);
      }
      return web3.eth.getTransactionCount(from, 'pending', function(err, nonce){
        if (err != null) {
          return cb(err);
        }
        return web3.eth.estimateGas({
          from: from,
          nonce: nonce,
          to: to,
          data: data
        }, function(err, estimate){
          var dec, res, val;
          if (err != null) {
            return cb(null, {
              calcedFee: network.txFee,
              gasPrice: gasPrice
            });
          }
          dec = getDec(network);
          res = times(gasPrice, estimate);
          val = div(res, Math.pow(10, 18));
          return cb(null, val);
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
    var url, dec, tx, amount, time, fee;
    url = network.api.url;
    dec = getDec(network);
    network = 'eth';
    tx = t.hash;
    amount = div(t.value, dec);
    time = t.timeStamp;
    url = url + "/tx/" + tx;
    fee = div(times(t.cumulativeGasUsed, t.gasPrice), dec);
    return {
      network: network,
      tx: tx,
      amount: amount,
      fee: fee,
      time: time,
      url: url,
      from: t.from,
      to: t.to
    };
  });
  up = function(s){
    return (s != null ? s : "").toUpperCase();
  };
  out$.getTransactions = getTransactions = function(arg$, cb){
    var network, address, apiUrl, module, action, startblock, endblock, sort, query;
    network = arg$.network, address = arg$.address;
    apiUrl = network.api.apiUrl;
    if (address.startsWith('V')) {
      address = xzoToEth(address);
    }
    module = 'account';
    action = 'tokentx';
    startblock = 0;
    endblock = 99999999;
    sort = 'asc';
    query = stringify({
      module: module,
      action: action,
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
          return it.contractAddress === ethToVlx(network.address);
        })(
        result.result));
        return cb(null, txs);
      });
    });
  };
  getWeb3 = commonProvider.getWeb3;
  getDec = commonProvider.getDec;
  calcGasPrice = function(arg$, cb){
    var web3, feeType;
    web3 = arg$.web3, feeType = arg$.feeType;
    if (feeType === 'cheap') {
      return cb(null, '3000000000');
    }
    return web3.eth.getGasPrice(cb);
  };
  round = function(num){
    return Math.round(+num);
  };
  out$.createTransaction = createTransaction = curry$(function(arg$, cb){
    var network, account, recipient, amount, amountFee, feeType, txType, dec, privateKey, from;
    network = arg$.network, account = arg$.account, recipient = arg$.recipient, amount = arg$.amount, amountFee = arg$.amountFee, feeType = arg$.feeType, txType = arg$.txType;
    if (!isAddress(recipient)) {
      return cb("address in not correct ethereum address");
    }
    dec = getDec(network);
    privateKey = new Buffer(account.privateKey.replace(/^0x/, ''), 'hex');
    from = account.address;
    if (from != null && from.startsWith('V')) {
      from = xzoToEth(from);
    }
    if (recipient != null && recipient.startsWith('V')) {
      recipient = xzoToEth(recipient);
    }
    return commonProvider.web3EthGetTransactionCount(
      { address: from, status: 'pending', network },
      function (err, { nonce, web3 }) {
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
        web3: web3,
        feeType: feeType
      }, function(err, gasPriceBn){
        var gasPrice, gasMinimal, gasEstimate;
        gasPrice = gasPriceBn.toFixed();
        if (err != null) {
          return cb(err);
        }
        gasMinimal = div(toWeiEth(amountFee), gasPrice);
        gasEstimate = round(times(gasMinimal, 5));
        if (toString$.call(web3.eth.getBalance).slice(8, -1) !== 'Function') {
          return cb("getBalance is not a function");
        }
        return commonProvider.web3EthGetBalance(
          from,
          network,
          function (err, balance) {
          var balanceEth;
          if (err != null) {
            return cb(err);
          }
          balanceEth = toEth(balance);
          if (+balanceEth < +amountFee) {
            return cb("Balance is not enough to send tx");
          }
          return getBalance({
            network: network,
            address: from
          }, function(err, ercBalance){
            var data, tx, rawtx;
            if (err != null) {
              return cb(err);
            }
            if (+ercBalance < +amount) {
              return cb("Balance is not enough to send this amount");
            }
            data = (function(){
              switch (false) {
              case contract.methods == null:
                return contract.methods.transfer(recipient, value).encodeABI();
              default:
                return contract.transfer.getData(recipient, value);
              }
            }());
            tx = new Tx({
              nonce: toHex(nonce),
              gasPrice: toHex(gasPrice),
              value: toHex("0"),
              gas: toHex(gasEstimate),
              to: network.address,
              from: from,
              data: data || '0x'
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
    var address, network, e, valid;
    address = arg$.address, network = arg$.network;
    if (address.startsWith('V')) {
      try {
        address = xzoToEth(address);
      } catch (e$) {
        e = e$;
        return cb("Address is not valid");
      }
    }
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
