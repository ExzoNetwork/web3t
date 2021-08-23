export mainnet =
    disabled: yes 
    decimals: 18  
    tx-fee: \0.002   
    tx-fee-options:
        auto: \0.002
        cheap: \0.002
    api:
        provider: \huobi
        apiUrl : \""
        web3Provider : ""
        url: \""
    group: 'Heco'
            
export testnet =
    disabled: no 
    decimals: 18  
    tx-fee: \0.000001
    tx-fee-options:
        auto: \0.000020
        cheap: \0.000020
    api:
        provider: \huobi    
        web3Provider : \https://http-testnet.hecochain.com
        url : \https://testnet.hecoinfo.com
        apiUrl : \https://api-testnet.hecoinfo.com/api 
    group: 'Heco'
    
    FOREIGN_BRIDGE: "0x719C8490730ADBBA514eec7173515a4A572dA736"    
    
    networks:           
        vlx_huobi:
            id: "vlx_huobi"
            name: "Huobi (Velas)" 
            referTo: "vlx_huobi"

    
export color = \#9E4FEB
export type = \coin
export enabled = yes
export name = 'Huobi'
export token = \huobi   
export nickname = \ht   
export market = "https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/chart?id=2502&range=ALL"  
export image = "data:image/png;base64,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"
export usd-info = "url(https://explorer.velas.com/ticker).price_usd"
