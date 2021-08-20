mainnet-config =
    disabled: no 
    decimals: 6
    tx-fee: \0.0014
    tx-fee-options:
        auto: \0.0020
        cheap: \0.00014
    message-prefix: 'Ethereum'
    mask: \0x0000000000000000000000000000000000000000
    txFeeIn: "vlx2"
    txBridgeFeeIn: "vlx2"
    address: "0x1E4f16C92026B96D5bb42045993657d8b39253E9",
    
    ERC20BridgeToken: "0x8C543AED163909142695f2d2aCd0D55791a9Edb9",
    group: "Velas"
    
    api:
        provider: \velas_usdt    
        web3Provider: 'https://evmexplorer.velas.com/rpc',
        url: 'https://evmexplorer.velas.com',
        apiUrl: 'https://evmexplorer.velas.com/api'
    networks:
        usdt_erc20:
            id: "usdt_erc20"
            name: "Tether USD (Ethereum)"
            referTo: "usdt_erc20" 
        
testnet-config =
    disabled: no 
    decimals: 6
    tx-fee: \0.0014
    tx-fee-options:
        auto: \0.0020
        cheap: \0.0020
    message-prefix: 'Ethereum'
    mask: \0x0000000000000000000000000000000000000000
    txFeeIn: "vlx2"
    txBridgeFeeIn: "vlx2"
    address: "0x90f69A6134fD1cf45170AC55a895138da69B40aD"
    
    ERC20BridgeToken    : "0xb404c51bbc10dcbe948077f18a4b8e553d160084"    
    HomeBridge          : "0x4a114C7a9e6581eB716085655DecBB416776ec7c"        
    ForeignBridge       : "0xF30aC574c31270173A201027B12c3bC9734C9C26"
    BridgeableToken     : "0x90f69A6134fD1cf45170AC55a895138da69B40aD"  
    
    api:
        provider: \velas_usdt 
        web3Provider: 'https://rpc-tokenbridge.gw.testnet.veladev.net',
        url: 'https://evmexplorer.testnet.velas.com',
        apiUrl: 'https://evmexplorer.testnet.velas.com/api'

    group: "Velas"

    networks:
        usdt_erc20:
            id: "usdt_erc20"
            name: "Tether USD (Ethereum)"
            referTo: "usdt_erc20"   

export mainnet =  mainnet-config
export testnet = testnet-config
export color = \#9E4FEB
export type = \coin
export enabled = yes
export wallet-index = 2
export name = 'Tether USD'
export token = \vlx_usdt   
export nickname = \usdt 
export market = "https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/chart?id=4747&range=ALL" 
export image: "data:image/png;base64,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"
export usd-info = "url(https://explorer.velas.com/ticker).price_usd"