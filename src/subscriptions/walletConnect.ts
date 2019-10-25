import { WalletConnectProvider, BufferBlock, Block } from '../provider/types'

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
    const onAccountsChanged: WalletConnectSubscriptions['onAccountsChanged'] = (cb, once) => {
        if (once) {
            provider.once('accountsChanged', cb)
        } else {
            provider.on('accountsChanged', cb)
        }
        return () => {
            provider.off('accountsChanged', cb)
        }
    }

    const onNetworkChanged: WalletConnectSubscriptions['onNetworkChanged'] = (cb, once) => {
        if (once) {
            provider.once('networkChanged', cb)
        } else {
            provider.on('networkChanged', cb)
        }

        return () => {
            provider.off('networkChanged', cb)
        }
    }
    const onChainChanged: WalletConnectSubscriptions['onChainChanged'] = (cb, once) => {
        if (once) {
            provider.once('chainChanged', cb)
        } else {
            provider.on('chainChanged', cb)
        }

        return () => {
            provider.off('chainChanged', cb)
        }
    }
    const onPayload: WalletConnectSubscriptions['onPayload'] = (cb, once) => {
        if (once) {
            provider.once('payload', cb)
        } else {
            provider.on('payload', cb)
        }

        return () => {
            provider.off('payload', cb)
        }
    }
    const onBlock: WalletConnectSubscriptions['onBlock'] = (cb, once) => {
        if (once) {
            provider.once('block', cb)
        } else {
            provider.on('block', cb)
        }

        return () => {
            provider.off('block', cb)
        }
    }
    const onRawBlock: WalletConnectSubscriptions['onRawBlock'] = (cb, once) => {
        if (once) {
            provider.once('rawBlock', cb)
        } else {
            provider.on('rawBlock', cb)
        }

        return () => {
            provider.off('rawBlock', cb)
        }
    }
    const onLatestBlock: WalletConnectSubscriptions['onLatestBlock'] = (cb, once) => {
        if (once) {
            provider.once('latest', cb)
        } else {
            provider.on('latest', cb)
        }

        return () => {
            provider.off('latest', cb)
        }
    }

    const onError: WalletConnectSubscriptions['onError'] = (cb, once) => {
        if (once) {
            provider.once('error', cb)
        } else {
            provider.on('error', cb)
        }

        return () => {
            provider.off('error', cb)
        }
    }
    const onConnect: WalletConnectSubscriptions['onConnect'] = (cb, once) => {
        if (once) {
            provider.once('connect', cb)
        } else {
            provider.on('connect', cb)
        }

        return () => {
            provider.off('connect', cb)
        }
    }
    const onSync: WalletConnectSubscriptions['onSync'] = (cb, once) => {
        if (once) {
            provider.once('sync', cb)
        } else {
            provider.on('sync', cb)
        }

        return () => {
            provider.off('sync', cb)
        }
    }
    const onStart: WalletConnectSubscriptions['onStart'] = (cb, once) => {
        if (once) {
            provider.once('start', cb)
        } else {
            provider.on('start', cb)
        }

        return () => {
            provider.off('start', cb)
        }
    }
    const onStop: WalletConnectSubscriptions['onStop'] = (cb, once) => {
        if (once) {
            provider.once('stop', cb)
        } else {
            provider.on('stop', cb)
        }

        return () => {
            provider.off('stop', cb)
        }
    }

    return {
        [WalletConnectSubscriptionsSymbol]: true,
        onAccountsChanged,
        onNetworkChanged,
        onChainChanged,
        onPayload,
        onError,
        onConnect,
        onBlock,
        onRawBlock,
        onLatestBlock,
        onSync,
        onStart,
        onStop,
    }
}

export default createWalletConnectSubscriptions
