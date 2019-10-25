import { MetamaskProvider } from '../provider/types'

export const MetamaskSubscriptionsSymbol = Symbol('MetamaskSubscriptions')

export interface MetamaskSubscriptions {
    [MetamaskSubscriptionsSymbol]: true
    onAccountsChanged(callback: (accounts: string[]) => void, once?: boolean): () => void
    onNetworkChanged(callback: (networkId: string) => void, once?: boolean): () => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onData(callback: (error: Error | null, payload: any) => void, once?: boolean): () => void
    onError(callback: (message: string) => void, once?: boolean): () => void
}

const createMetamaskSubscriptions = (provider: MetamaskProvider): MetamaskSubscriptions => {
    const onAccountsChanged: MetamaskSubscriptions['onAccountsChanged'] = (cb, once) => {
        if (once) {
            provider.once('accountsChanged', cb)
        } else {
            provider.on('accountsChanged', cb)
        }

        return () => {
            provider.off('accountsChanged', cb)
        }
    }

    const onNetworkChanged: MetamaskSubscriptions['onNetworkChanged'] = (cb, once) => {
        if (once) {
            provider.once('networkChanged', cb)
        } else {
            provider.on('networkChanged', cb)
        }

        return () => {
            provider.off('networkChanged', cb)
        }
    }
    const onData: MetamaskSubscriptions['onData'] = (cb, once) => {
        if (once) {
            provider.once('data', cb)
        } else {
            provider.on('data', cb)
        }

        return () => {
            provider.off('data', cb)
        }
    }

    const onError: MetamaskSubscriptions['onError'] = (cb, once) => {
        if (once) {
            provider.once('error', cb)
        } else {
            provider.on('error', cb)
        }

        return () => {
            provider.off('error', cb)
        }
    }

    return {
        [MetamaskSubscriptionsSymbol]: true,
        onAccountsChanged,
        onNetworkChanged,
        onData,
        onError,
    }
}

export default createMetamaskSubscriptions
