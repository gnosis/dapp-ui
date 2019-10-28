import { MetamaskProvider } from '../provider/types'

export const MetamaskProviderStateSymbol = Symbol('MetamaskProviderState')

export interface MetamaskProviderState {
    [MetamaskProviderStateSymbol]: true
    isMetaMask: true
    autoRefreshOnNetworkChange: boolean
    networkVersion: string
    chainId: number
    selectedAddress: string | null
    accounts: string[]
    isConnected: boolean
    isEnabled: boolean
    isApproved: Promise<boolean>
    isUnlocked: Promise<boolean>
}

const getMetamaskProviderState = (provider: MetamaskProvider): MetamaskProviderState => {
    const { isMetaMask, autoRefreshOnNetworkChange, networkVersion, chainId, selectedAddress } = provider
    return {
        [MetamaskProviderStateSymbol]: true,
        isMetaMask,
        autoRefreshOnNetworkChange,
        networkVersion,
        chainId: +chainId,
        selectedAddress,
        // don't return null for accounts[]
        accounts: selectedAddress == null ? [] : [selectedAddress],
        isConnected: provider.isConnected(),
        isEnabled: provider._metamask.isEnabled(),
        isApproved: provider._metamask.isApproved(),
        isUnlocked: provider._metamask.isUnlocked(),
    }
}

export default getMetamaskProviderState
