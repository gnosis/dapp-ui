import { WalletConnectProvider, BufferBlock, Block } from '../provider/types'
import { generateSubscriptionFunctionForProvider } from './common'

export const WalletConnectSubscriptionsSymbol = Symbol('WalletConnectSubscriptions')

export interface WalletConnectSubscriptions {
    [WalletConnectSubscriptionsSymbol]: true
    onAccountsChanged(callback: (accounts: string[]) => void, once?: boolean): () => void
    onNetworkChanged(callback: (networkId: string) => void, once?: boolean): () => void
    onChainChanged(callback: (chainId: number) => void, once?: boolean): () => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onPayload(callback: (payload: any) => void, once?: boolean): () => void
    onError(callback: (error: Error) => void, once?: boolean): () => void
    onConnect(callback: () => void, once?: boolean): () => void
    onBlock(callback: (block: BufferBlock) => void, once?: boolean): () => void
    onRawBlock(callback: (block: Block) => void, once?: boolean): () => void
    onLatestBlock(callback: (block: Block) => void, once?: boolean): () => void
    onSync(
        callback: ({ oldBlock, newBlock }: { oldBlock: string; newBlock: string }) => void,
        once?: boolean,
    ): () => void
    onStart(callback: () => void, once?: boolean): () => void
    onStop(callback: () => void, once?: boolean): () => void
}

const createWalletConnectSubscriptions = (provider: WalletConnectProvider): WalletConnectSubscriptions => {
    const generateSubscriptionFunction = generateSubscriptionFunctionForProvider(provider)

    return {
        [WalletConnectSubscriptionsSymbol]: true,
        onAccountsChanged: generateSubscriptionFunction('accountsChanged'),
        onNetworkChanged: generateSubscriptionFunction('networkChanged'),
        onChainChanged: generateSubscriptionFunction('chainChanged'),
        onPayload: generateSubscriptionFunction('payload'),
        onError: generateSubscriptionFunction('error'),
        onConnect: generateSubscriptionFunction('connect'),
        onBlock: generateSubscriptionFunction('block'),
        onRawBlock: generateSubscriptionFunction('rawBlock'),
        onLatestBlock: generateSubscriptionFunction('latest'),
        onSync: generateSubscriptionFunction('sync'),
        onStart: generateSubscriptionFunction('start'),
        onStop: generateSubscriptionFunction('stop'),
    }
}

export default createWalletConnectSubscriptions
