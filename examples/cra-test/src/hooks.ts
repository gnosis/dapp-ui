import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import Web3 from 'web3'
import {
    getProvider,
    Provider,
    isMetamaskProvider,
    getProviderState,
    createSubscriptions,
    isWalletConnectProvider,
    isMetamaskSubscriptions,
    isWalletConnectSubscriptions,
    WalletConnectInits,
    WalletConnectProvider,
} from '@gnosis.pm/dapp-ui'
import { BlockHeader, Block } from 'web3-eth'

// --------------------------------------------------

// helper hook for if mounted check

export const useIfMounted = () => {
    const mounted = useRef(false)

    useEffect(() => {
        mounted.current = true
        return () => { mounted.current = false }
    })

    return useCallback<IFElseFunc>(<T extends AnyFunc, U extends AnyFunc>(ifMountedFunc: T | null | undefined, ifNotMountedFunc?: U): ReturnType<T | U> | void => {
        if (mounted.current && ifMountedFunc) return ifMountedFunc()
        if (!mounted.current && ifNotMountedFunc) return ifNotMountedFunc()
    }, [])
}

type AnyFunc = (...args: any[]) => any
interface IFElseFunc {
    <T extends AnyFunc>(ifMountedFunc: T): ReturnType<T> | void
    <T extends AnyFunc, U extends AnyFunc>(ifMountedFunc: T, ifNotMountedFunc: U): ReturnType<T | U>
    <U extends AnyFunc>(ifMountedFunc: undefined | null, ifNotMountedFunc: U): void | ReturnType<U>
}

// --------------------------------------------------

const windowLoaded = new Promise(resolve => {
    if (document.readyState === "complete") return resolve();
    window.addEventListener("load", resolve, {once: true});
  });

const closeWCconnection = (provider: WalletConnectProvider) => {
    if (getProviderState(provider).isConnected) {
        console.log('closing WC session')
        provider.close()
    }
}

// sets up on-demand provider
// handles disconnect for WalletConnect
// and logout for Metamask

export const useProvider = (wcOptions?: WalletConnectInits) => {
    const [provider, setProvider] = useState<Provider | null>(null)
    // error from provider creation / web3connect modal
    const [error, setError] = useState<Error | null>(null)

    const ifMounted = useIfMounted()

    const { connectToProvider, disconnectFromProvider } = useMemo(() => {
        // keep provider reference inside the closure
        // so that we don't have to recreate disconnectFromProvider on provider change
        let providerInClosure: Provider | null

        const connectToProvider = async () => {
            try {
                await windowLoaded

                providerInClosure = await getProvider(wcOptions)
                console.log('providerInClosure', providerInClosure);
                // null when modal was closed without choosing a provider
                // don't reset provider, but consider it an action cancellation
                if (!providerInClosure) return

                ifMounted(() => unstable_batchedUpdates(() => {
                    setError(null)
                    setProvider(providerInClosure)
                }))


            } catch (error) {
                console.error('Error connecting to provider', error)
                ifMounted(() => unstable_batchedUpdates(() => {
                    setError(error)
                    setProvider(null)
                }))
            }

            return providerInClosure
        }

        const disconnectFromProvider = () => {
            // kill WalletConnect session if it's still connected
            if (isWalletConnectProvider(providerInClosure)) closeWCconnection(providerInClosure)

            ifMounted(() => {
                setError(null)
                setProvider(null)
            })
        }

        return { connectToProvider, disconnectFromProvider }
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isMetamaskProvider(provider)) {
            // for MetaMask disable page refresh on network change
            provider.autoRefreshOnNetworkChange = false

            const { onAccountsChanged } = createSubscriptions(provider);
            // for Metamask remove provider on logout
            // also remove listener on cleanup (when provider changes)
            const unsub = onAccountsChanged(accounts => {
                if (accounts.length > 0) return
                // accounts  = [] when user locks Metamask

                console.log('Metamask logout')
                ifMounted(() => unstable_batchedUpdates(() => {
                    setError(null)
                    setProvider(null)
                }))
            })

            return () => {
                console.log('unsub from Metamask in cleanup', unsub)
                unsub()
            }
        } else if (isWalletConnectProvider(provider)) {
            const { onStop } = createSubscriptions(provider);
            // for WalletConnect remove provider on disconnect
            // also remove listener on cleanup (when provider changes)
            const unsub = onStop(() => {
                console.log('WC session closed')
                ifMounted(() => unstable_batchedUpdates(() => {
                    setError(null)
                    setProvider(null)
                }))
            })

            const killWC = () => closeWCconnection(provider)

            // disconnect on page close
            window.addEventListener('beforeunload', killWC)

            return () => {
                console.log('unsub from WC in cleanup', unsub)
                unsub()
                window.removeEventListener('beforeunload', killWC)
            }
        }
    }, [provider, ifMounted])

    return { connectToProvider, disconnectFromProvider, provider, error }
}

// --------------------------------------------------

// tracks account as long as provider is given
// can eliminate provider argument if use React context with provider
export const useCurrentAccount = (provider: Provider) => {
    const [account, setAccount] = useState(() => {
        const providerState = getProviderState(provider)
        return (providerState && providerState.accounts[0]) || ''
    })

    const ifMounted = useIfMounted()

    useEffect(() => {
        const subs = createSubscriptions(provider)
        if (subs) return subs.onAccountsChanged(([account]) => ifMounted(() => setAccount(account)))
    }, [provider, ifMounted])

    return account
}

// --------------------------------------------------

type Network = 'mainnet' | 'ropsten' | 'rinkeby' | 'goerli' | 'kovan'

const id2Network: { [K: number]: Network } = {
    1: 'mainnet',
    3: 'ropsten',
    4: 'rinkeby',
    5: 'goerli',
    42: 'kovan'
};

// tracks network as long as provider is given

export const useNetwork = (provider: Provider): Network => {
    const [chainId, setChainId] = useState(() => {
        const providerState = getProviderState(provider)
        return providerState && providerState.chainId
    })

    const ifMounted = useIfMounted()

    useEffect(() => {
        const subs = createSubscriptions(provider)
        const setChainIfMounted = (chainId: string | number) => ifMounted(() => setChainId(+chainId))

        if (isMetamaskSubscriptions(subs)) return subs.onNetworkChanged(setChainIfMounted)
        if (isWalletConnectSubscriptions(subs)) return subs.onChainChanged(setChainIfMounted)
    }, [provider, ifMounted])

    return id2Network[+chainId]
}

// --------------------------------------------------

// creates a Web3 instance for each new provider

export const useWeb3 = (provider: Provider | undefined | null) => useMemo(() => {
    if (!provider) return null
    return new Web3(provider as any)
}, [provider])


// --------------------------------------------------

// tracks balance of the current account

export const useAccountBalance = ({ account, web3 }: { account: string, web3: Web3 }) => {
    const [balance, setBalance] = useState('0')

    const ifMounted = useIfMounted()

    useEffect(() => {
        if (!account) return
        const setBalanceIfMounted = (balance: string) => ifMounted(() => setBalance(balance))
        web3.eth.getBalance(account).then(setBalanceIfMounted)

        const sub = web3.eth.subscribe('newBlockHeaders').on('data', (blockHeader: BlockHeader) => {
            console.log('newBlockHeaders', blockHeader);
            web3.eth.getBalance(account).then(setBalanceIfMounted)
        })

        return () => { sub.unsubscribe() }
    }, [account, ifMounted, web3])

    return balance
}

// --------------------------------------------------

interface BlockchainUpdatePrompt {
    account: string
    chainId: number
    blockHeader: BlockHeader | null
}

// to track chain state, be that current account balance or token balance of that account
// or any data on the chain belonging to that account
// we need to refetch that data when
// 1: network changes
// 2: account changes
// 3: new block is mined

// provides subscription to blockhain updates for account/network/block
const subscribeToBlockchainUpdate = ({ provider, web3 }: { provider: Provider, web3: Web3 }) => {
    const subs = createSubscriptions(provider)

    let networkUpdate: (callback: (chainId: number) => void) => () => void

    if (isMetamaskSubscriptions(subs)) networkUpdate = cb => subs.onNetworkChanged(networkId => cb(+networkId))
    if (isWalletConnectSubscriptions(subs)) networkUpdate = subs.onChainChanged

    const accountsUpdate = subs.onAccountsChanged

    const blockUpdate = (cb: (blockHeader: BlockHeader) => void) => web3.eth.subscribe('newBlockHeaders')
        .on('data', cb)

    const { accounts: [account], chainId } = getProviderState(provider)

    let blockchainPrompt: BlockchainUpdatePrompt = {
        account,
        chainId: +chainId,
        blockHeader: null
    }

    return (callback: (changedChainData: BlockchainUpdatePrompt) => void) => {
        const unsubNetwork = networkUpdate(chainId => {
            blockchainPrompt = { ...blockchainPrompt, chainId }
            callback(blockchainPrompt)
        })
        const unsubAccounts = accountsUpdate(([account]) => {
            blockchainPrompt = { ...blockchainPrompt, account }
            callback(blockchainPrompt)
        })

        const blockSub = blockUpdate(blockHeader => {
            blockchainPrompt = { ...blockchainPrompt, blockHeader }
            callback(blockchainPrompt)
        })
        const unsubBlock = () => blockSub.unsubscribe()

        return () => {
            unsubNetwork()
            unsubAccounts()
            unsubBlock()
        }
    }
}


interface AnyBlockchainUpdateInterface {
    callback: (changedChainData: BlockchainUpdatePrompt) => void
    provider: Provider
    web3: Web3
}

// generic hook that calls callback with {account, network, blockHeader} updated data
// immediately and on every update of any of them

export const useAnyBlockchainState = ({ callback, provider, web3 }: AnyBlockchainUpdateInterface) => {
    useEffect(() => {
        const { accounts: [account], chainId } = getProviderState(provider)
        const blockchainPrompt: BlockchainUpdatePrompt = {
            account,
            chainId: +chainId,
            blockHeader: null
        }
        callback(blockchainPrompt)

        return subscribeToBlockchainUpdate({ provider, web3 })(callback)
    }, [provider, web3])  // eslint-disable-line react-hooks/exhaustive-deps
}

// specialization of useAnyBlockchainState hook for current account's balance
// would return new balance when account changes, network changes or a new block is mined

export const useCurrentAccountBalance = ({ provider, web3 }: { provider: Provider, web3: Web3 }) => {
    const [balance, setBalance] = useState<string>('0')

    const ifMounted = useIfMounted()

    const callback = ({ account }: BlockchainUpdatePrompt) => {
        if (!account) setBalance('0')
        const setBalanceIfMounted = (balance: string) => ifMounted(() => setBalance(balance))
        web3.eth.getBalance(account).then(setBalanceIfMounted)
    }

    useAnyBlockchainState({ provider, web3, callback })

    return balance
}

// specialization of useAnyBlockchainState hook for current block
// would return new latest block when account changes, network changes or a new block is mined

export const useCurrentBlock = ({ provider, web3 }: { provider: Provider, web3: Web3 }) => {
    const [block, setBlock] = useState<Block | null>(null)

    const ifMounted = useIfMounted()

    const callback = () => {
        const setBlockIfMounted = (block: Block) => ifMounted(() => setBlock(block))
        web3.eth.getBlock('latest').then(setBlockIfMounted)
    }

    useAnyBlockchainState({ provider, web3, callback })

    return block
}
