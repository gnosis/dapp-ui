import Web3Connect from 'web3connect'
import WalletConnectProviderPackage from '@walletconnect/web3-provider'
import { WalletConnectProvider, Provider } from './types'
declare module '@walletconnect/web3-provider' {
    export default interface WalletConnectProviderPackage {
        new (options: WalletConnectOptionsInfura | WalletConnectOptionsRPC): WalletConnectProvider
    }
}

export {
    Provider,
    MetamaskProvider,
    WalletConnectProvider,
    WalletConnector,
    Block,
    BufferBlock,
    JSONRPCRequestPayload,
    JSONRPCResponsePayload,
} from './types'

type WalletConnectOptions = Parameters<typeof Web3Connect.ConnectToWalletConnect>[1]

export interface WalletConnectInits {
    package: WalletConnectProviderPackage
    options: WalletConnectOptions
}
interface IgetProvider {
    (walletConnectOptions?: WalletConnectInits): Promise<Provider | null>
}

const getProvider: IgetProvider = walletConnectInits => {
    const web3Connect = new Web3Connect.Core({
        providerOptions: {
            // in truth it's optional, but required in the interface
            walletconnect: walletConnectInits as WalletConnectInits,
        },
    })

    let unsubFuncs: ((() => void) | void)[]

    const providerPromise = new Promise<Provider | null>((resolve, reject) => {
        unsubFuncs = [
            // provider connected, resolve(provider)
            web3Connect.on('connect', resolve),
            // modal closed, resolve(null)
            web3Connect.on('close', () => resolve(null)),
            // error during connection or modal opening, reject(error)
            web3Connect.on('error', reject),
        ]
        // futureproof for when .on returns an unsubbing function
    }).finally(() => unsubFuncs.forEach(unsub => unsub && unsub()))

    web3Connect.toggleModal() // open modal

    return providerPromise
}

export default getProvider
