import { MetamaskProvider, WalletConnectProvider, Provider } from '../provider'
import { isMetamaskProvider, isWalletConnectProvider } from '../utils'
import getMetamaskProviderState, { MetamaskProviderState } from './metamask'
import getWalletConnectProvider, { WalletConnectProviderState } from './walletconnect'

export type ProviderState = MetamaskProviderState | WalletConnectProviderState

export { MetamaskProviderState, WalletConnectProviderState }

function getProviderState(provider: null | undefined): null
function getProviderState(provider: MetamaskProvider): MetamaskProviderState
function getProviderState(provider: WalletConnectProvider): WalletConnectProviderState
function getProviderState(provider: Provider): ProviderState
function getProviderState(provider: Provider | undefined | null): ProviderState | null
function getProviderState(provider: Provider | undefined | null): ProviderState | null {
    if (!provider) return null

    if (isMetamaskProvider(provider)) return getMetamaskProviderState(provider)

    if (isWalletConnectProvider(provider)) return getWalletConnectProvider(provider)

    return null
}

export default getProviderState
