import { Provider, MetamaskProvider, WalletConnectProvider } from './provider/types'

import { Subscriptions, MetamaskSubscriptions, WalletConnectSubscriptions } from './subscriptions'
import { MetamaskSubscriptionsSymbol } from './subscriptions/metamask'
import { WalletConnectSubscriptionsSymbol } from './subscriptions/walletConnect'

import { ProviderState, MetamaskProviderState, WalletConnectProviderState } from './provider-state'
import { MetamaskProviderStateSymbol } from './provider-state/metamask'
import { WalletConnectProviderStateSymbol } from './provider-state/walletconnect'

export const isMetamaskProvider = (provider: Provider | undefined | null): provider is MetamaskProvider => {
    return !!provider && 'isMetaMask' in provider && provider.isMetaMask
}
export const isWalletConnectProvider = (provider: Provider | undefined | null): provider is WalletConnectProvider => {
    return !!provider && 'isWalletConnect' in provider && provider.isWalletConnect
}

export const isMetamaskState = (
    providerState: ProviderState | null | undefined,
): providerState is MetamaskProviderState => {
    return !!providerState && providerState[MetamaskProviderStateSymbol] === true
}
export const isWalletConnectState = (
    providerState: ProviderState | null | undefined,
): providerState is WalletConnectProviderState => {
    return !!providerState && providerState[WalletConnectProviderStateSymbol] === true
}

export const isMetamaskSubscriptions = (
    subscriptions: Subscriptions | null | undefined,
): subscriptions is MetamaskSubscriptions => {
    return !!subscriptions && subscriptions[MetamaskSubscriptionsSymbol] === true
}
export const isWalletConnectSubscriptions = (
    subscriptions: Subscriptions | null | undefined,
): subscriptions is WalletConnectSubscriptions => {
    return !!subscriptions && subscriptions[WalletConnectSubscriptionsSymbol] === true
}
