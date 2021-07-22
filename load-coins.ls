require! {
    \./plugins/btc-coin.ls : btc
    \./plugins/eth-coin.ls : eth
    \./plugins/symblox.ls : symblox
    \./plugins/symblox-v2.ls : symblox-v2
    \./plugins/ltc-coin.ls : ltc
    \./plugins/usdt-coin.ls : usdt
    \./plugins/sol-coin.ls : sol
    \./plugins/vlx_erc20-coin.ls : vlx_erc20
    \./plugins/vlx-coin.ls : vlx
    \./plugins/bnb-coin.ls : bnb
    \./plugins/vlx_bep20-coin.ls : vlx_bep20
    \prelude-ls : { obj-to-pairs, pairs-to-obj, filter }
}
only-coins = (plugins)->
    plugins
        |> obj-to-pairs
        |> filter (.1?type is \coin)
        |> pairs-to-obj
extend-coins = (coins, config)->
    return if typeof! config.plugins isnt \Object
    coins <<<< only-coins config.plugins
module.exports = (config, cb)->
    #eos
    def = { btc, eth, ltc, usdt, vlx_erc20, sol, vlx, symblox, symblox-v2, bnb, vlx_bep20  }
    extend-coins def, config
    cb null, def
