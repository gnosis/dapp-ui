import React, { useState } from 'react'
import Web3Connect from 'web3connect'
// API
import getWeb3Api from '../../api/web3'
// Components
import DisplayWeb3 from '../DisplayWeb3'
import { SAFE_WALLETCONNECT_BRIDGE } from '../../globals'

// Types
import { provider as ProviderType, Web3Api } from '../../types'

const Web3ConnectButton: React.FC = () => {
    const [web3Api, setWeb3Api] = useState<Web3Api>()

    return (
        <>
            <Web3Connect.Button
                providerOptions={{
                    walletconnect: {
                        bridge: SAFE_WALLETCONNECT_BRIDGE,
                    },
                }}
                onConnect={async (provider: ProviderType): Promise<void> => {
                    console.log(
                        'Web3Connect.Button::Connected to',
                        typeof provider === 'object' ? provider.constructor.name : provider,
                    )
                    const web3Api = await getWeb3Api({ customProvider: provider }) // add provider to web3Api
                    setWeb3Api(web3Api)
                }}
                onClose={(): void => {
                    console.log('Web3Connect Modal Closed') // modal has closed
                }}
                label={web3Api ? 'Change Wallet' : 'Connect'}
            />
            {web3Api && <DisplayWeb3 title="WEB3CONNECT BUTTON" web3Api={web3Api} />}
        </>
    )
}

export default Web3ConnectButton
