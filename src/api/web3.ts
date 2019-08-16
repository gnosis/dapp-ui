import Web3 from 'web3'
import { Block } from 'web3-eth'
import { provider } from 'web3-providers'
import { TransactionReceipt, Transaction } from 'web3-core'

import { windowLoaded } from './utils'

declare global {
    interface Window {
        ethereum: provider & {
            enable: () => Promise<string[]>
            on?: () => EventListener
        }
        web3: Web3
    }
}

export interface Web3FrontendAPI {
    web3: Web3
    getCurrentAccount: () => Promise<string>
    getAccounts: () => Promise<string[]>
    getBalance: (account?: string) => Promise<string>
    getBlock: (blockNumberOrString: string | number) => Promise<Partial<Block>>
    getNetwork: () => Promise<string | number>
    getNetworkName: (id?: number | string) => Promise<string>
    getNetworkProviderURL: (id: number | string) => string
    getTransaction: (txHash: string) => Promise<Transaction>
    getTransactionReceipt: (txHash: string) => Promise<TransactionReceipt>
    // Utils
    isAddress: (address: string) => boolean
    isReadOnly: () => boolean
    // Provider Specific
    resetProvider(): void
    setProvider(provider: string): void
}

export interface Web3SetupOptions {
    customProvider?: provider | string
    reloadOnAccountsChange?: boolean
}

let web3API: Web3FrontendAPI

let readOnly: boolean

export const getWeb3API = async (options: Web3SetupOptions = {}, force?: boolean): Promise<Web3FrontendAPI> => {
    if (!force && web3API) return web3API

    return setupWeb3(options)
}

const getProvider = async ({ customProvider, reloadOnAccountsChange }: Web3SetupOptions): Promise<Web3> => {
    let provider: Web3

    // wait window load then check window globals...
    await windowLoaded

    // Use Custom Provider if passed in
    if (customProvider) provider = new Web3(customProvider)
    // No Custom Provider? Check window.ethereum
    else if (window && window.ethereum) {
        provider = new Web3(window.ethereum)

        // enable Provider, if possible
        await window.ethereum.enable().catch((error: Error) => {
            throw new Error(error.message)
        })

        if (window.ethereum.on && reloadOnAccountsChange) {
            window.ethereum.on('accountsChanged', function() {
                window.location.reload()
            })
        }
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

async function setupWeb3(options: Web3SetupOptions): Promise<Web3FrontendAPI> {
    const web3 = await getProvider(options)

    async function getCurrentAccount(): Promise<string> {
        try {
            const [acct] = await web3.eth.getAccounts()
            return acct
        } catch (e) {
            throw e
        }
    }

    async function getAccounts(): Promise<string[]> {
        try {
            return web3.eth.getAccounts()
        } catch (error) {
            console.error(new Error(error))
            return []
        }
    }

    const getBalance = async (account: string): Promise<string> => web3.eth.getBalance(account)

    async function getBlock(block: string | number = 'latest'): Promise<Partial<Block>> {
        try {
            const returnedBlock: Block = await web3.eth.getBlock(block)
            return {
                number: returnedBlock.number,
                timestamp: returnedBlock.timestamp,
            }
        } catch (e) {
            console.log('error getting block details', e)
            return {
                number: 0,
                timestamp: 0,
            }
        }
    }

    const getNetwork = async (): Promise<number> => web3.eth.net.getId()
    const getNetworkName = async (id?: number | string): Promise<string> => {
        id = id || (await getNetwork())

        switch (id) {
            case '1':
            case 1:
                return `mainnet`
            case '3':
            case 3:
                return `ropsten`
            case '4':
            case 4:
                return `rinkeby`
            case '5':
            case 5:
                return `goerli`
            default:
                return 'private'
        }
    }

    function getNetworkProviderURL(id: number | string): string {
        switch (id) {
            case '1':
            case 1:
                return `https://mainnet.infura.io/v3/90f210707d3c450f847659dc9a3436ea`
            case '3':
            case 3:
                return `https://ropsten.infura.io/v3/90f210707d3c450f847659dc9a3436ea`
            case '4':
            case 4:
                return `https://rinkeby.infura.io/v3/90f210707d3c450f847659dc9a3436ea`
            case '5':
            case 5:
                return `https://goerli.infura.io/v3/90f210707d3c450f847659dc9a3436ea`
            default:
                return 'private'
        }
    }

    const getTransaction = async (txHash: string): Promise<Transaction> => web3.eth.getTransaction(txHash)
    const getTransactionReceipt = async (txHash: string): Promise<TransactionReceipt> =>
        web3.eth.getTransactionReceipt(txHash)

    /* Provider Specific */
    const setProvider = web3.setProvider.bind(web3)
    const resetProvider = (): void => setProvider(web3.currentProvider)

    /* Provider Utils */
    const isAddress = (address: string): boolean => web3.utils.isAddress(address)
    const isReadOnly = (): boolean => readOnly

    return {
        web3,
        getCurrentAccount,
        getAccounts,
        getBalance,
        getBlock,
        getNetwork,
        getNetworkName,
        getNetworkProviderURL,
        getTransaction,
        getTransactionReceipt,
        // Utils
        isAddress,
        isReadOnly,
        setProvider,
        resetProvider,
    }
}

export default getWeb3API
