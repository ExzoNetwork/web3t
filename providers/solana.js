// Generated by LiveScript 1.6.0
(function(){
  var moment, ref$, map, pairsToObj, foldl, any, each, find, sum, filter, head, values, join, reverse, uniqueBy, sortBy, get, post, plus, minus, div, times, BitcoinLib, bip39, jsonParse, deadline, decode, guid, BN, bs58, Buffer, tweetnacl, solanaWeb3, lo, assert, bip32, findMax, calcFee, makeQuery, toBase58, toBuffer, getAccountInfo, getKeys, extend, getDec, addAmount, parseRateString, extractVal, parseResult, getDepositAddressInfo, getError, getRecentBlockhash, getAccount, freeOwnership, swapNativeToEvmData, swapNativeToEvm, createTransaction, pushTx, getTotalReceived, getUnconfirmedBalance, getBalance, getApiUrl, checkTxStatus, getTransactions, prepareRawTxs, getIndexOfObj, cache, getTxData, prepareTxs, getSentAmount, getAction, isValidAddress, getTransactionInfo, getMarketHistoryPrices, out$ = typeof exports != 'undefined' && exports || this, slice$ = [].slice, toString$ = {}.toString;
  moment = require('moment');
  ref$ = require('prelude-ls'), map = ref$.map, pairsToObj = ref$.pairsToObj, foldl = ref$.foldl, any = ref$.any, each = ref$.each, find = ref$.find, sum = ref$.sum, filter = ref$.filter, head = ref$.head, values = ref$.values, join = ref$.join, reverse = ref$.reverse, uniqueBy = ref$.uniqueBy, sortBy = ref$.sortBy;
  ref$ = require('./superagent.js'), get = ref$.get, post = ref$.post;
  ref$ = require('../math.js'), plus = ref$.plus, minus = ref$.minus, div = ref$.div, times = ref$.times;
  ref$ = require('./deps.js'), BitcoinLib = ref$.BitcoinLib, bip39 = ref$.bip39;
  jsonParse = require('../json-parse.js');
  deadline = require('../deadline.js');
  decode = require('bs58').decode;
  guid = require('../guid');
  BN = require('bn.js').BN;
  bs58 = require('bs58');
  Buffer = require('buffer').Buffer;
  tweetnacl = require('tweetnacl');
  bip39 = require('bip39');
  solanaWeb3 = require('./solana/index.cjs.js');
  lo = require('buffer-layout');
  assert = require('assert');
  bip32 = require('bip32');
  findMax = function(first, current){
    if (current.rank < first.rank) {
      return current;
    } else {
      return first;
    }
  };
  out$.calcFee = calcFee = function(config, cb){
    var network, tx, txType, account;
    network = config.network, tx = config.tx, txType = config.txType, account = config.account;
    return makeQuery(network, 'getRecentBlockhash', [], function(err, result){
      var ref$, lamportsPerSignature, dec, txFee, fee;
      if (err != null) {
        return cb(err);
      }
      if (result.value.err != null) {
        return cb("Error: " + (result != null ? result.err : void 8));
      }
      if ((result != null ? (ref$ = result.value) != null ? ref$.feeCalculator : void 8 : void 8) == null) {
        return cb("Error: " + (result != null ? result.text : void 8));
      }
      lamportsPerSignature = result.value.feeCalculator.lamportsPerSignature;
      dec = getDec(network);
      txFee = network.txFee;
      fee = (function(){
        switch (false) {
        case lamportsPerSignature == null:
          return div(lamportsPerSignature, dec);
        default:
          return txFee;
        }
      }());
      return cb(null, {
        calcedFee: fee
      });
    });
  };
  makeQuery = function(network, method, params, cb){
    var web3Provider, query;
    web3Provider = network.api.web3Provider;
    query = {
      jsonrpc: '2.0',
      id: guid(),
      method: method,
      params: params
    };
    return post(web3Provider, query).end(function(err, data){
      var ref$;
      if (err != null) {
        return cb("query err: " + ((ref$ = err.message) != null ? ref$ : err));
      }
      if (data.body.error != null) {
        return cb(data.body.error);
      }
      return cb(null, data.body.result);
    });
  };
  toBase58 = function(obj){
    return bs58.encode(obj);
  };
  toBuffer = function(arr){
    if (arr instanceof Buffer) {
      return arr;
    } else {
      if (arr instanceof Uint8Array) {
        return Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength);
      } else {
        return Buffer.from(arr);
      }
    }
  };
  getAccountInfo = function(network, address, cb){
    address = data.address;
    return makeQuery(network, 'getAccountInfo', [
      address, {
        "encoding": "base58"
      }
    ], function(err, result){
      if (err != null) {
        return cb(err);
      }
      if (result == null) {
        return cb("Error: " + err);
      }
      return cb(null, result.value);
    });
  };
  out$.getKeys = getKeys = function(arg$, cb){
    var network, mnemonic, index;
    network = arg$.network, mnemonic = arg$.mnemonic, index = arg$.index;
    return getAccount(mnemonic, index, function(err, acc){
      return cb(null, acc);
    });
  };
  extend = curry$(function(add, json){
    return import$(json, add);
  });
  getDec = function(network){
    var decimals;
    decimals = network.decimals;
    return Math.pow(10, decimals);
  };
  addAmount = curry$(function(network, it){
    var dec;
    dec = getDec(network);
    return it.amount = (function(){
      switch (false) {
      case it.value == null:
        return div(it.value, dec);
      default:
        return 0;
      }
    }());
  });
  parseRateString = function(usdInfo){
    var ref$, _, url, extract;
    ref$ = usdInfo.match(/url\(([^)]+)\)(.+)?/), _ = ref$[0], url = ref$[1], extract = ref$[2];
    return {
      url: url,
      extract: extract
    };
  };
  extractVal = function(data, arg$){
    var head, tail;
    head = arg$[0], tail = slice$.call(arg$, 1);
    if (head == null) {
      return data;
    }
    return extractVal(data[head], tail);
  };
  parseResult = function(text, extract, cb){
    if ((extract != null ? extract : "") === "") {
      return cb(null, text);
    }
    return jsonParse(text, function(err, model){
      var result;
      if (err != null) {
        return cb(err);
      }
      result = extractVal(model, extract);
      return cb(null, result);
    });
  };
  getDepositAddressInfo = function(arg$, cb){
    var amount, recipient, network, ref$, mixingInfo, url, extract;
    amount = arg$.amount, recipient = arg$.recipient, network = arg$.network;
    mixingInfo = ((ref$ = network != null ? network.api : void 8) != null
      ? ref$
      : {}).mixingInfo;
    if (toString$.call(mixingInfo).slice(8, -1) !== 'String') {
      return cb("Mixing Pool is not connected");
    }
    ref$ = parseRateString(mixingInfo), url = ref$.url, extract = ref$.extract;
    return get(url).end(function(err, data){
      var ref$;
      if (err != null) {
        return cb("cannot get deposit info - err: " + ((ref$ = err.message) != null ? ref$ : err));
      }
      return cb(null, parseResult(data.text, extract));
    });
  };
  getError = function(config, fields){
    var result;
    result = join(", ")(
    map(function(it){
      return it + " is required field";
    })(
    filter(function(it){
      return config[it] == null;
    })(
    fields)));
    if (result === "") {
      return null;
    }
    return result;
  };
  getRecentBlockhash = function(network, cb){
    return makeQuery(network, 'getRecentBlockhash', [{
      commitment: "max"
    }], function(err, result){
      var ref$;
      if (err != null) {
        return cb(err);
      }
      if (result.value.err != null) {
        return cb("Error: " + (result != null ? result.err : void 8));
      }
      if ((result != null ? (ref$ = result.value) != null ? ref$.blockhash : void 8 : void 8) == null) {
        return cb("Error: " + (result != null ? result.text : void 8));
      }
      return cb(null, result.value.blockhash);
    });
  };
  out$.getAccount = getAccount = function(mnemonic, index, cb){
    var seed, hexSeed, derivedSeed, privateKeyBuff, publicKey, privateKey;
    seed = bip39.mnemonicToSeed(mnemonic);
    hexSeed = seed.toString('hex');
    derivedSeed = bip32.fromSeed(seed).derivePath("m/44'/5655640'/" + index + "'/0").privateKey;
    privateKeyBuff = tweetnacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    publicKey = tweetnacl.sign.keyPair.fromSeed(derivedSeed).publicKey;
    privateKey = toBase58(privateKeyBuff);
    publicKey = toBase58(publicKey);
    return cb(null, {
      address: publicKey,
      privateKey: privateKey,
      publicKey: publicKey,
      secretKey: privateKeyBuff
    });
  };
  freeOwnership = function(){
    var ds, b;
    ds = lo.struct([lo.u32('tag')]);
    b = Buffer.alloc(4);
    ds.encode({
      tag: 2
    }, b);
    return b;
  };
  swapNativeToEvmData = function(lamports, addr){
    var ds, b;
    ds = lo.struct([lo.u32('tag'), lo.nu64('lamports'), lo.nu64('array_len')]);
    assert.strictEqual(ds.offsetOf('tag'), 0);
    assert.strictEqual(ds.offsetOf('lamports'), 4);
    assert.strictEqual(ds.offsetOf('array_len'), 12);
    b = Buffer.alloc(20);
    ds.encode({
      tag: 1,
      lamports: lamports,
      array_len: 42
    }, b);
    return Buffer.concat([b, Buffer.from(addr, "utf8")]);
  };
  swapNativeToEvm = function(owner, lamports, addr){
    var EVM_STATE, EVM_CODE, keys, transaction, err;
    EVM_STATE = new solanaWeb3.PublicKey('EvmState11111111111111111111111111111111111');
    EVM_CODE = new solanaWeb3.PublicKey('EVM1111111111111111111111111111111111111111');
    keys = [
      {
        pubkey: EVM_STATE,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: owner,
        isSigner: false,
        isWritable: true
      }
    ];
    transaction = new solanaWeb3.Transaction();
    try {
      transaction.add(solanaWeb3.SystemProgram.assign({
        accountPubkey: owner,
        programId: EVM_CODE
      }));
      transaction.add(new solanaWeb3.TransactionInstruction({
        keys: keys,
        data: swapNativeToEvmData(lamports, addr),
        programId: EVM_CODE
      }));
      transaction.add(new solanaWeb3.TransactionInstruction({
        keys: keys,
        data: freeOwnership(),
        programId: EVM_CODE
      }));
    } catch (e$) {
      err = e$;
      console.error("err:", err);
      return;
    }
    return transaction;
  };
  out$.createTransaction = createTransaction = function(config, cb){
    var err, network, account, recipient, amount, amountFee, data, feeType, txType, gasPrice, gas, swap, dec, payAccount;
    err = getError(config, ['network', 'account', 'amount', 'amountFee', 'recipient']);
    if (err != null) {
      return cb(err);
    }
    network = config.network, account = config.account, recipient = config.recipient, amount = config.amount, amountFee = config.amountFee, data = config.data, feeType = config.feeType, txType = config.txType, gasPrice = config.gasPrice, gas = config.gas, swap = config.swap;
    dec = getDec(network);
    payAccount = new solanaWeb3.Account(config.account.secretKey);
    return getRecentBlockhash(network, function(err, recentBlockhash){
      var transactionData, amount, transaction, toHex, encoded;
      if (err != null) {
        return cb(err);
      }
      transactionData = {};
      amount = times(config.amount, dec);
      transaction = {};
      toHex = function(it){
        return new BN(it);
      };
      if (swap != null && swap === true) {
        transaction = swapNativeToEvm(payAccount.publicKey, amount, recipient);
        transaction.recentBlockhash = recentBlockhash;
      } else {
        transactionData = solanaWeb3.SystemProgram.transfer({
          fromPubkey: payAccount.publicKey,
          toPubkey: recipient,
          lamports: amount
        });
        transaction = new solanaWeb3.Transaction({
          recentBlockhash: recentBlockhash
        }).add(transactionData);
      }
      try {
        transaction.sign(payAccount);
      } catch (e$) {
        err = e$;
        console.error("Tx sign error:", err);
      }
      encoded = transaction.serialize().toString('base64');
      return cb(null, {
        rawTx: encoded
      });
    });
  };
  out$.pushTx = pushTx = curry$(function(config, cb){
    return makeQuery(config.network, 'sendTransaction', [
      config.rawTx, {
        encoding: 'base64'
      }
    ], function(err, result){
      if (err != null) {
        return cb(err);
      }
      if (err != null) {
        return cb("[push-tx] Error: " + err);
      }
      return cb(null, result);
    });
  });
  out$.getTotalReceived = getTotalReceived = function(arg$, cb){
    var address, network, ref$;
    address = arg$.address, network = arg$.network;
    if ((network != null ? (ref$ = network.api) != null ? ref$.url : void 8 : void 8) == null) {
      return cb("Url is not defined");
    }
    return get(getApiUrl(network) + "/address/" + address + "/totalReceived").timeout({
      deadline: deadline
    }).end(function(err, data){
      var dec, num;
      if (err != null || data.text.length === 0) {
        return cb(err);
      }
      dec = getDec(network);
      num = div(data.text, dec);
      return cb(null, num);
    });
  };
  out$.getUnconfirmedBalance = getUnconfirmedBalance = function(arg$, cb){
    var network, address;
    network = arg$.network, address = arg$.address;
    return cb("Not Implemented");
  };
  out$.getBalance = getBalance = function(arg$, cb){
    var network, address;
    network = arg$.network, address = arg$.address;
    return makeQuery(network, 'getBalance', [address], function(err, result){
      var dec, number, balance;
      if (err != null) {
        return cb(err);
      }
      dec = getDec(network);
      number = result.value;
      balance = div(number, dec);
      return cb(null, balance);
    });
  };
  getApiUrl = function(network){
    var apiName, ref$, networkName, ref1$;
    apiName = (ref$ = network.api.apiName) != null ? ref$ : 'api';
    networkName = ((ref$ = global.store) != null ? (ref1$ = ref$.current) != null ? ref1$.network : void 8 : void 8) || 'mainnet';
    return network.api.url + "/" + apiName + "/BTC/" + networkName;
  };
  out$.checkTxStatus = checkTxStatus = function(arg$, cb){
    var network, tx;
    network = arg$.network, tx = arg$.tx;
    return cb("Not Implemented");
  };
  out$.getTransactions = getTransactions = function(arg$, cb){
    var network, address, ref$;
    network = arg$.network, address = arg$.address;
    if ((network != null ? (ref$ = network.api) != null ? ref$.url : void 8 : void 8) == null) {
      return cb("Url is not defined");
    }
    return makeQuery(network, 'getConfirmedSignaturesForAddress2', [
      address, {
        limit: 20
      }
    ], function(err, result){
      var txs;
      if (err != null) {
        return cb(err);
      }
      txs = result;
      if (txs.length === 0) {
        return cb(null, []);
      }
      return prepareRawTxs({
        txs: txs,
        network: network,
        address: address
      }, function(err, allTxs){
        if (err != null) {
          return cb(err);
        }
        if (toString$.call(allTxs).slice(8, -1) !== 'Array') {
          return cb("Unexpected result");
        }
        return cb(null, allTxs);
      });
    });
  };
  prepareRawTxs = function(arg$, cb){
    var txs, network, address, $txs;
    txs = arg$.txs, network = arg$.network, address = arg$.address;
    $txs = reverse(
    sortBy(function(it){
      return it.blockTime;
    })(
    txs));
    return prepareTxs(network, $txs, address, function(err, result){
      return cb(null, result);
    });
  };
  getIndexOfObj = function(arr, pubKey){
    var index, count;
    index = -1;
    count = 0;
    each(function(it){
      var index;
      count++;
      if (it.pubkey === pubKey) {
        return index = count;
      }
    })(
    arr);
    return index;
  };
  cache = {
    transactions: {}
  };
  getTxData = function(network, signature, cb){
    if (cache.transactions[signature] != null) {
      return cb(null, cache.transactions[signature]);
    }
    return makeQuery(network, 'getConfirmedTransaction', [signature, 'jsonParsed'], function(err, data){
      if (err != null) {
        return cb(err);
      }
      cache.transactions[signature] = data;
      return cb(null, data);
    });
  };
  prepareTxs = function(network, arg$, address, cb){
    var tx, rest, blockTime, signature, slot;
    tx = arg$[0], rest = slice$.call(arg$, 1);
    if (tx == null) {
      return cb(null, []);
    }
    blockTime = tx.blockTime, signature = tx.signature, slot = tx.slot;
    return getTxData(network, signature, function(err, data){
      var t, txData, sender, receiver, hash, amount, ref$, fee, status, transaction, accountKeys, instructions, type, dec, from, to, value, ref1$, ref2$, index, senders, receiverIndex, receivers, e, time, url, cluster, customUrl, $cluster, uri, _type, recipientType, isStake, ref3$, ref4$, txType, _tx;
      if (err != null) {
        console.error("Error occured while fetching tx details for signature:", signature);
      }
      t = [];
      if (err == null && data != null) {
        txData = data;
        sender = '';
        receiver = '';
        hash = '';
        amount = 0;
        ref$ = txData.meta, fee = ref$.fee, err = ref$.err, status = ref$.status;
        transaction = txData.transaction;
        ref$ = transaction.message, accountKeys = ref$.accountKeys, instructions = ref$.instructions;
        type =
          (function(){
            switch (true) {
              case !instructions[instructions.length - 1].parsed || !instructions[instructions.length - 1].parsed.type:
                return "unknown";
              case instructions[1] && instructions[1].parsed && instructions[1].parsed.type === "swapNativeToEvm":
                return "swapNativeToEvm";
              case instructions[0] && instructions[0].parsed && instructions[0].parsed.type === "createAccountWithSeed" &&
                instructions[1] && instructions[1].parsed && instructions[1].parsed.type === "initialize" &&
                instructions.length === 2:
                return "createAccountWithSeed";
              default:
                return instructions[instructions.length - 1].parsed.type;
            }
          }());
        dec = getDec(network);
        try {
          if (type === "unknown") {
            var findIndex = (arr, func) => {
              var result = -1;
              for(var i = 0; i < arr.length; i++){
                if(func(arr[i])) {
                  return i;
                }
              }
              return result;
            }
            var foundParticipantIndex = (func) => {
              const preBalances  = txData.meta.preBalances;
              const postBalances = txData.meta.postBalances;
              for (var i = 0; i < preBalances.length; i++) {
                var preBalance  = preBalances[i];
                var postBalance = postBalances[i];
                var diff = preBalance - postBalance;
                if (func(diff)) {
                  return i;
                }
              }
              return -1;
            }
            const foundIndex  = findIndex(accountKeys, (it) => {return it.pubkey === address});
            const preBalance  = txData.meta.preBalances[foundIndex];
            const postBalance = txData.meta.postBalances[foundIndex];
            const _amount     = foundIndex > -1 ? postBalance - preBalance : 0;
            amount = Math.abs(_amount);

            const participantIndex = foundParticipantIndex((it) => {return Math.abs(it) === amount});
            sender   = _amount < 0 ? address : (participantIndex > -1 ? accountKeys[participantIndex].pubkey : 'unknown');
            receiver = _amount < 0 ? (participantIndex > -1 ? accountKeys[participantIndex].pubkey : 'unknown') : address;
            hash = transaction.signatures[0];
          }
          if (type === "swapNativeToEvm") {
            sender = instructions[1].parsed.info.fromNativeAccount;
            receiver = instructions[1].parsed.info.toEvmAccount;
            amount = instructions[1].parsed.info.lamports;
            hash = transaction.signatures[0];
          }
          if (type === "evmTransaction") {
            ref$ = instructions[0].parsed.info.transaction, from = ref$.from, to = ref$.to, value = ref$.value, hash = ref$.hash;
            sender = instructions[0].parsed.info.bridgeAccount;
            receiver = (ref$ = accountKeys != null ? (ref1$ = accountKeys[2]) != null ? ref1$.pubkey : void 8 : void 8) != null ? ref$ : to;
            amount = div(value, dec);
            hash = (ref$ = transaction != null ? (ref2$ = transaction.signatures) != null ? ref2$[0] : void 8 : void 8) != null ? ref$ : hash;
          }
          if (type === "assign") {
            sender = instructions[0].parsed.info.account;
            receiver = instructions[0].parsed.info.owner;
            hash = transaction.signatures[0];
            amount = (ref$ = getSentAmount(txData)[sender]) != null ? ref$ : 0;
          }
          if (type === "delegate") {
            sender = instructions[0].parsed.info.stakeAccount;
            receiver = instructions[0].parsed.info.voteAccount;
            hash = transaction.signatures[0];
            amount = instructions[0].parsed.info.lamports;
          }
          if (type === "createAccountWithSeed") {
            sender = instructions[0].parsed.info.base;
            receiver = instructions[0].parsed.info.newAccount;
            amount = instructions[0].parsed.info.lamports;
            hash = transaction.signatures[0];
          }
          if (type === "deactivate") {
            sender = instructions[0].parsed.info.stakeAuthority;
            receiver = instructions[0].programId;
            hash = transaction.signatures[0];
            amount = 0;
          }
          if (type === "withdraw") {
            sender = (ref$ = instructions[0].parsed.info.stakeAccount) != null
              ? ref$
              : instructions[0].parsed.info.stakeAccount;
            receiver = instructions[0].parsed.info.withdrawAuthority;
            amount = instructions[0].parsed.info.lamports;
            hash = transaction.signatures[0];
          }
          if (type === "split") {
            amount = instructions[1].parsed.info.lamports;
            receiver = instructions[1].parsed.info.newSplitAccount;
            hash = transaction.signatures[0];
          }
          if (type === "transfer") {
            const Idata = instructions[instructions.length - 1];
            sender = Idata.parsed.info.source;
            receiver = Idata.parsed.info.destination;
            amount = Idata.parsed.info.lamports;
            hash = transaction.signatures[0];
          }
          if (type === "buy") {
            index = (function(){
              switch (false) {
              case !(instructions.length > 1):
                return 1;
              default:
                return 0;
              }
            }());
            sender = instructions[index].parsed.info.source;
            receiver = instructions[index].parsed.info.destination;
            amount = instructions[index].parsed.info.lamports;
            hash = transaction.signatures[0];
          }
          if (type == null) {
            senders = filter(function(it){
              return it.signer === true;
            })(
            accountKeys);
            receiverIndex = 0;
            receivers = filter(function(it){
              var isReceiver;
              isReceiver = it.signer === false && it.writable === true;
              if (!isReceiver) {
                receiverIndex++;
              }
              return isReceiver;
            })(
            accountKeys);
            sender = accountKeys[0].pubkey;
            receiver = accountKeys[2].pubkey;
            hash = transaction.signatures[0];
            amount = (ref$ = getSentAmount(txData)[receiver]) != null ? ref$ : 0;
          }
        } catch (e$) {
          e = e$;
          console.error("error:", e);
        }
        time = moment(+blockTime * 1000).format("X");
        dec = getDec(network);
        ref$ = network.api, url = ref$.url, cluster = ref$.cluster, customUrl = ref$.customUrl;
        $cluster = cluster != null ? "?cluster=" + cluster : "";
        uri = (url + "/tx/" + hash) + $cluster;
        _type = (function(){
          switch (false) {
          case address === receiver:
            return "OUT";
          default:
            return "IN";
          }
        }());
        recipientType = 'regular';
        isStake = (ref$ = (ref3$ = instructions[0]) != null ? (ref4$ = ref3$.parsed) != null ? ref4$.type : void 8 : void 8) === 'stake' || ref$ === 'createAccountWithSeed' || ref$ === 'delegate' || ref$ === 'deactivate';
        try {
          txType = (function(){
            var ref$;
            switch (false) {
            case !(type != null && type === "swapNativeToEvm"):
              return "Native → EVM Swap";
            case !(type != null && (type === 'stake' || type === 'delegate' || type === 'deactivate' || type === 'withdraw')):
              return (type + " Stake").toUpperCase();
            case !(type != null && (type === 'createAccount' || type === 'createAccountWithSeed')):
              return "create stake account".toUpperCase();
            case !(type != null && (type !== 'transfer' && type !== 'assign' && type !== 'buy' && type !== 'unknown')):
              return type.toUpperCase();
            case !(type != null && type === 'assign' && receiver === "EVM1111111111111111111111111111111111111111"):
              return "Native → EVM Swap";
            case ((ref$ = instructions[0]) != null ? ref$.programId : void 8) !== "EVM1111111111111111111111111111111111111111":
              return "EVM → Native Swap";
            default:
              return null;
            }
          }());
          _tx = {
            tx: hash,
            amount: div(amount, dec),
            url: uri,
            to: receiver,
            pending: !(txData.meta.status.Ok == null),
            from: sender != null ? sender : "unknown",
            time: time,
            fee: div(txData.meta.fee, dec),
            type: _type,
            recipientType: recipientType,
            txType: txType
          };
          t = [_tx];
        } catch (e$) {
          err = e$;
          console.error(err);
        }
      }
      return prepareTxs(network, rest, address, function(err, other){
        var all;
        all = t.concat(other);
        return cb(null, all);
      });
    });
  };
  getSentAmount = function(tx){
    var index, postBalances, preBalances, accounts;
    if (tx == null) {
      return 0;
    }
    index = 0;
    postBalances = tx.meta.postBalances;
    preBalances = tx.meta.preBalances;
    accounts = tx.transaction.message.accountKeys;
    return pairsToObj(
    map(function(it){
      var preBalance, ref$, postBalance, diff;
      preBalance = (ref$ = preBalances[index]) != null ? ref$ : 0;
      postBalance = (ref$ = postBalances[index]) != null ? ref$ : 0;
      index++;
      diff = minus(preBalance + "", postBalance + "");
      return [it.pubkey, Math.abs(+diff)];
    })(
    accounts));
  };
  getAction = function(instructions, arg$){
    var receiver, res, action;
    receiver = arg$.receiver;
    res = find(function(it){
      return it.parsed.info.destination === receiver;
    })(
    instructions);
    return action = (function(){
      switch (false) {
      case res == null:
        return res.parsed.type;
      default:
        return 'transfer';
      }
    }());
  };
  out$.isValidAddress = isValidAddress = function(arg$, cb){
    var address, network, validKey, err;
    address = arg$.address, network = arg$.network;
    try {
      validKey = new solanaWeb3.PublicKey(address);
    } catch (e$) {
      err = e$;
      return cb("Address is not valid");
    }
    return cb(null, address);
  };
  out$.getTransactionInfo = getTransactionInfo = function(config, cb){
    var network, tx, signature;
    network = config.network, tx = config.tx;
    signature = tx;
    return makeQuery(network, 'getConfirmedTransaction', [signature, 'jsonParsed'], function(err, data){
      var txData, ref$, fee, status, transaction, accountKeys, instructions, senders, sender, receiver, result;
      if (err != null) {
        return cb(err);
      }
      if (err == null && data == null) {
        return cb(null, {
          status: 'pending'
        });
      }
      txData = data;
      ref$ = txData.meta, fee = ref$.fee, err = ref$.err, status = ref$.status;
      transaction = txData.transaction;
      ref$ = transaction.message, accountKeys = ref$.accountKeys, instructions = ref$.instructions;
      senders = filter(function(it){
        return it.signer === true;
      })(
      accountKeys);
      sender = senders[0].pubkey;
      instructions = transaction.message.instructions;
      receiver = instructions[0].parsed.info.destination;
      status = (function(){
        switch (false) {
        case !(txData.meta.status.Ok !== undefined):
          return 'confirmed';
        default:
          return 'pending';
        }
      }());
      result = {
        from: sender,
        to: receiver,
        status: status,
        info: tx,
        data: data
      };
      return cb(null, result);
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
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
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
