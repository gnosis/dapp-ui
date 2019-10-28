import createMetamaskSubscriptions, { MetamaskSubscriptions } from './metamask'
import createWalletConnectSubscriptions, { WalletConnectSubscriptions } from './walletConnect'
import { MetamaskProvider, WalletConnectProvider, Provider } from '../provider/types'

export {
    createMetamaskSubscriptions,
    createWalletConnectSubscriptions,
    MetamaskSubscriptions,
    WalletConnectSubscriptions,
}

import { isMetamaskProvider, isWalletConnectProvider } from '../utils'

export type Subscriptions = MetamaskSubscriptions | WalletConnectSubscriptions

function createSubscriptions(provider: null | undefined): null
function createSubscriptions(provider: MetamaskProvider): MetamaskSubscriptions
function createSubscriptions(provider: WalletConnectProvider): WalletConnectSubscriptions
function createSubscriptions(provider: Provider): Subscriptions
function createSubscriptions(provider: Provider | undefined | null): Subscriptions | null
function createSubscriptions(provider: Provider | undefined | null): Subscriptions | null {
    if (!provider) return null

    if (isMetamaskProvider(provider)) {
        return createMetamaskSubscriptions(provider)
    } else if (isWalletConnectProvider(provider)) {
        return createWalletConnectSubscriptions(provider)
    } else return null
}

export default createSubscriptions
