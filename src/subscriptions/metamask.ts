import { MetamaskProvider } from '../provider/types'
import { generateSubscriptionFunctionForProvider } from './common'

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
    const generateSubscriptionFunction = generateSubscriptionFunctionForProvider(provider)

    return {
        [MetamaskSubscriptionsSymbol]: true,
        onAccountsChanged: generateSubscriptionFunction('accountsChanged'),
        onNetworkChanged: generateSubscriptionFunction('networkChanged'),
        onData: generateSubscriptionFunction('data'),
        onError: generateSubscriptionFunction('error'),
    }
}

export default createMetamaskSubscriptions
