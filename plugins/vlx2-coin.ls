mainnet-config =
    decimals: 18
    tx-fee: \0.0014
    tx-fee-options:
        auto: \0.0020
        cheap: \0.00014
    message-prefix: 'Ethereum'
    mask: \V0000000000000
    api:
        provider: \velas2
        web3Provider : \https://explorer.velas.com/rpc
        url : \https://explorer.velas.com
        apiUrl : \https://explorer.velas.com/api
    networks:
        #evm:
            #id: "evm"    
            #name: "Ethereum"    
            #HomeBridge          : "0x38E20F6224449eCB50A81188147cbf990a00eA44"        
            #ForeignBridge       : "0x1E4f16C92026B96D5bb42045993657d8b39253E9"
            #ERC20BridgeToken    : "0x8C543AED163909142695f2d2aCd0D55791a9Edb9" 
            #eferTo             : "vlx_erc20"   
        native:
            id: "native" 
            name: "Velas Native" 
            HomeBridge          : ""
            ForeignBridge       : "" 
            ERC20BridgeToken    : ""
            referTo             : "vlx"
testnet-config =
    #because it unavailable frequently
    # disabled: yes
    decimals: 18
    tx-fee: \0.0014
    tx-fee-options:
        auto: \0.0020
        cheap: \0.0020
    message-prefix: 'Ethereum'
    mask: \V0000000000000
    api:
        provider: \velas2
        web3Provider : \https://bridge.next.velas.com/rpc
        url : \https://bridge.next.velas.com
        apiUrl : \https://bridge.next.velas.com/api
    networks:
        #evm:
            #id: "evm"    
            #name: "Velas EVM"    
            #HomeBridge          : "0x38E20F6224449eCB50A81188147cbf990a00eA44"        
            #ForeignBridge       : "0x1E4f16C92026B96D5bb42045993657d8b39253E9"
            #ERC20BridgeToken    : "0x8C543AED163909142695f2d2aCd0D55791a9Edb9" 
            #referTo             : "vlx_erc20"   
        native:
            id: "native" 
            name: "Velas Native" 
            HomeBridge          : "0x56454c41532d434841494e000000000053574150"
            ForeignBridge       : "" 
            ERC20BridgeToken    : ""
            referTo             : "vlx"
testnet2-config =
    disabled: yes
    decimals: 18
    tx-fee: \0.0014
    tx-fee-options:
        auto: \0.0020
        cheap: \0.00014
    message-prefix: 'Ethereum'
    mask: \V0000000000000
    api:
        provider: \velas2
        web3Provider : \https://tn.yopta.net/rpc
        #web3Provider: \https://mainnet.infura.io/v3/6a6c66740e9e4cea9cc8425869e9d106
        url : \https://testnet-v2.velas.com
        apiUrl : "http://139.59.138.137"
export mainnet =  mainnet-config
export testnet = if window?location?.href?.index-of('testnet2') > -1 then testnet2-config else testnet-config
export color = \#9E4FEB
export type = \coin
export enabled = yes
export name = 'Velas EVM'
export token = \vlx2
export nickname = \vlx
export image = "data:image/png;base64,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"
export usd-info = "url(https://explorer.velas.com/ticker).price_usd"