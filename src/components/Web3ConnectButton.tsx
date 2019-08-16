import React, { useState } from 'react'
import Web3Connect from 'web3connect'
// API
import { getWeb3API, Web3FrontendAPI } from '../api/web3'
// Components
import DisplayWeb3 from './DisplayWeb3'
// TS Types
import { provider as ProviderType } from 'web3-providers'

const Web3ConnectButton: React.FC = () => {
    const [web3FrontendAPI, setWeb3FrontendAPI] = useState<Web3FrontendAPI>()

    return (
        <>
            <Web3Connect.Button
                // providerOptions={{
                //     walletconnect: {
                //         bridge: 'https://safe-walletconnect.gnosis.io',
                //     },
                // }}
                onConnect={async (provider: ProviderType): Promise<void> => {
                    console.log(
                        'Web3Connect.Button::Connected to',
                        typeof provider === 'object' ? provider.constructor.name : provider,
                    )
                    const web3FrontendAPI = await getWeb3API({ customProvider: provider }) // add provider to web3FrontendAPI
                    setWeb3FrontendAPI(web3FrontendAPI)
                }}
                onClose={(): void => {
                    console.log('Web3Connect Modal Closed') // modal has closed
                }}
                label={web3FrontendAPI ? 'Change Wallet' : 'Connect'}
            />
            {web3FrontendAPI && <DisplayWeb3 web3FrontendAPI={web3FrontendAPI} />}
        </>
    )
}

export default Web3ConnectButton
