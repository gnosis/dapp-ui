import { WalletConnectProvider, WalletConnector } from '../provider'

export const WalletConnectProviderStateSymbol = Symbol('WalletConnectProviderState')

export interface WalletConnectProviderState {
    [WalletConnectProviderStateSymbol]: true
    bridge: string
    isConnecting: boolean
    isWalletConnect: true
    accounts: string[]
    chainId: number
    rpcUrl: string
    isConnected: boolean
    wc: WalletConnector
}

const getWalletConnectProviderState = (provider: WalletConnectProvider): WalletConnectProviderState => {
    const {
        bridge,
        isConnecting,
        isWalletConnect,
        rpcUrl,
        wc,
        wc: { accounts, chainId, connected },
    } = provider
    return {
        [WalletConnectProviderStateSymbol]: true,
        bridge,
        isConnecting,
        isWalletConnect,
        accounts,
        chainId,
        rpcUrl,
        isConnected: connected,
        wc,
    }
}

export default getWalletConnectProviderState
