import Web3 from 'web3'

import { windowLoaded } from '../utils'

import { NETWORK_ID_TO_NAME } from '../globals'

import { Block, TransactionReceipt, Transaction, Web3Api, Web3Options } from '../types'

let web3Api: Web3Api
let readOnly: boolean

export default async (options: Web3Options = {}, force?: boolean): Promise<Web3Api> => {
    if (!force && web3Api) return web3Api

    return setupWeb3(options)
}

const getWeb3Provider = async ({ customProvider, onAccountsChange }: Web3Options): Promise<Web3> => {
    let provider: Web3

    // wait window load then check window globals...
    await windowLoaded

    // Use Custom Provider if passed in
    if (customProvider) provider = new Web3(customProvider)
    // No Custom Provider? Check window.ethereum
    else if (window && window.ethereum) {
        provider = new Web3(window.ethereum)

        // enable Provider, if possible
        await window.ethereum.enable()

        onAccountsChange && onAccountsChange()
    }
    // Check for window.web3's current provider (if it exists)
    else if (window.web3 && window.web3.currentProvider) provider = new Web3(window.web3.currentProvider)
    // Else setup localhost version
    else {
        try {
            const url = 'http://localhost:8545'
            await fetch(url)
            console.debug('API/WEB3.ts => local node active')
            provider = new Web3(url)
        } catch (error) {
            if (error.readyState === 4 && (error.status === 400 || error.status === 200)) {
                // the endpoint is active
                console.debug('API/WEB3.ts catch block => Success')
            } else {
                console.debug('API/WEB3.ts =>  No web3 instance injected. Falling back to null provider.')
                readOnly = true
                provider = new Web3(null)
            }
        }
    }

    return provider
}

async function setupWeb3(options: Web3Options): Promise<Web3Api> {
    const web3 = await getWeb3Provider(options)

    async function getCurrentAccount(): Promise<string> {
        const [acct] = await web3.eth.getAccounts()
        return acct
    }

    const getAccounts = async (): Promise<string[]> => web3.eth.getAccounts()

    const getBalance = async (account: string): Promise<string> => web3.eth.getBalance(account)

    const getBlock = async (block: string | number = 'latest'): Promise<Block> => getBlock(block)

    const getNetwork = async (): Promise<number> => web3.eth.net.getId()
    const getNetworkName = async (id?: number | string): Promise<string> => {
        id = +(id || (await getNetwork()))

        return NETWORK_ID_TO_NAME[id]
    }

    const getTransaction = async (txHash: string): Promise<Transaction> => web3.eth.getTransaction(txHash)
    const getTransactionReceipt = async (txHash: string): Promise<TransactionReceipt> =>
        web3.eth.getTransactionReceipt(txHash)

    /* Provider Specific */
    const setProvider = web3.setProvider.bind(web3)
    const resetProvider = (): void => setProvider(web3.currentProvider)

    /* Provider Utils */
    const isReadOnly = (): boolean => readOnly

    return {
        // Web3 Object
        web3,
        // Functions
        getCurrentAccount,
        getAccounts,
        getBalance,
        getBlock,
        getNetwork,
        getNetworkName,
        getTransaction,
        getTransactionReceipt,
        // Utils
        isReadOnly,
        setProvider,
        resetProvider,
    }
}
