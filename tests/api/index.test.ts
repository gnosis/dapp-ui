import getWeb3API from '../../src/api/web3'

test('[Empty] Initialised frontend Web3 API is NOT undefined', async () => {
    const web3API = await getWeb3API()

    expect(web3API).toBeDefined()
})

test('[Custom Provider - Websocket] Rinkeby Websocket provider loads and host is correct', async () => {
    const customWebsocketProvider = 'wss://rinkeby.infura.io/ws'
    const web3API = await getWeb3API({
        customProvider: customWebsocketProvider,
    })

    expect(web3API).toBeDefined()

    const { web3 } = web3API
    expect(web3.currentProvider.host).toEqual(customWebsocketProvider)
})

test('[Custom Provider - Websocket] Function: getAccounts', async () => {
    const customWebsocketProvider = 'wss://rinkeby.infura.io/ws'
    const web3API = await getWeb3API({
        customProvider: customWebsocketProvider,
    })

    expect(web3API).toBeDefined()

    const { web3, getAccounts } = web3API
    expect(web3.currentProvider.host).toEqual(customWebsocketProvider)

    const accounts = await getAccounts()
    console.log('Accounts array =====>', accounts)
    expect(accounts).toHaveLength(0)
})

test('[Custom Provider - Websocket] Function: getBalance with known rinkeby address: 0x286E20d6e20d12D5Ba06F8eC2dAe91B7725f9188 (balance may vary, check code)', async () => {
    const customWebsocketProvider = 'wss://rinkeby.infura.io/ws'
    const web3API = await getWeb3API({
        customProvider: customWebsocketProvider,
    })

    expect(web3API).toBeDefined()

    const { web3, getBalance } = web3API
    expect(web3.currentProvider.host).toEqual(customWebsocketProvider)

    const account = '0x286E20d6e20d12D5Ba06F8eC2dAe91B7725f9188'
    const balance = await getBalance(account)
    console.log('Balance =====>', balance)
    expect(balance).toBeDefined()
    expect(balance).toBe('2420810177997150573')
})

test('[Custom Provider - Websocket] Function: getNetwork', async () => {
    const customWebsocketProvider = 'wss://rinkeby.infura.io/ws'
    const web3API = await getWeb3API({
        customProvider: customWebsocketProvider,
    })

    expect(web3API).toBeDefined()

    const { web3, getNetwork } = web3API
    expect(web3.currentProvider.host).toEqual(customWebsocketProvider)

    const network = await getNetwork()
    console.log('Network =====>', network)
    expect(network).toBe(4)
})

test('[Custom Provider - Websocket] Function: isAddress using known rinkeby address: 0x286E20d6e20d12D5Ba06F8eC2dAe91B7725f9188 and a fake one', async () => {
    const customWebsocketProvider = 'wss://rinkeby.infura.io/ws'
    const knownAccount = '0x286E20d6e20d12D5Ba06F8eC2dAe91B7725f9188'
    const fakeAddress = '0xI_AM_FAKE'

    const web3API = await getWeb3API({
        customProvider: customWebsocketProvider,
    })

    expect(web3API).toBeDefined()

    const { web3, isAddress } = web3API
    expect(web3.currentProvider.host).toEqual(customWebsocketProvider)

    const trueAddress = await isAddress(knownAccount)
    expect(trueAddress).toBe(true)

    const falseAddress = await isAddress(fakeAddress)
    expect(falseAddress).toBe(false)
})

test('[Custom Provider - Websocket] Function: getBlock', async () => {
    const customWebsocketProvider = 'wss://rinkeby.infura.io/ws'
    const web3API = await getWeb3API({
        customProvider: customWebsocketProvider,
    })

    expect(web3API).toBeDefined()

    const { web3, getBlock } = web3API
    expect(web3.currentProvider.host).toEqual(customWebsocketProvider)

    const latestBlock = await getBlock('latest')
    console.log('latestBlock =====>', latestBlock)
    expect(latestBlock.number).toBeDefined()
    expect(latestBlock.timestamp).toBeDefined()
})

test('[Custom Provider - Websocket] Function: getTransaction && getTransactionReceipt with known Rinkeby txHash', async () => {
    const customWebsocketProvider = 'wss://rinkeby.infura.io/ws'
    const knownTxHash = '0xdfef14d60038689b74e7ae2e21559ed52a902e9a328aaf884c76b821463afdc8'

    const web3API = await getWeb3API({
        customProvider: customWebsocketProvider,
    })

    expect(web3API).toBeDefined()

    const { web3, getTransaction, getTransactionReceipt } = web3API
    expect(web3.currentProvider.host).toEqual(customWebsocketProvider)

    const tx = await getTransaction(knownTxHash)
    const txReceipt = await getTransactionReceipt(knownTxHash)

    expect(tx).toBeDefined()
    expect(txReceipt).toBeDefined()

    expect(tx.blockHash).toEqual('0xc787071e895f07cfa384f0a17bfdbeccb319357c32525b1795c383786f8e14ce')
    expect(tx.blockNumber).toEqual(1215815)

    expect(txReceipt.blockHash).toEqual('0xc787071e895f07cfa384f0a17bfdbeccb319357c32525b1795c383786f8e14ce')
    expect(txReceipt.blockNumber).toEqual(1215815)
    expect(txReceipt.logs).toHaveLength(2)
})

test('[Custom Provider - Websocket] Function: setProvider ==> Switch from RINKEBY WSS to MAINNET WSS', async () => {
    const beforeWSS = 'wss://rinkeby.infura.io/ws'
    const afterWSS = 'wss://mainnet.infura.io/ws'

    const web3API = await getWeb3API({
        customProvider: beforeWSS,
    })

    expect(web3API).toBeDefined()

    const { web3, setProvider } = web3API

    // BEFORE
    console.log('Current Provider BEFORE:', web3.currentProvider.host)
    expect(web3.currentProvider.host).toEqual(beforeWSS)

    // Change provider
    setProvider(afterWSS)

    // AFTER
    console.log('Current Provider AFTER:', web3.currentProvider.host)
    expect(web3.currentProvider.host).toEqual(afterWSS)
})
