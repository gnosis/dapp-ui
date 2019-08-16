import React, { useState } from 'react'

import Web3Connect from 'web3connect'
import { provider as ProviderType } from 'web3-providers'
import { getWeb3API, Web3FrontendAPI } from '../api/web3'

import DisplayWeb3 from './Test_DisplayWeb3'

const Web3ConnectButton: React.FC = () => {
    const [web3, setWeb3] = useState<Web3FrontendAPI>()

    return (
        <>
            <Web3Connect.Button
                onConnect={async (provider: ProviderType): Promise<void> => {
                    console.log(
                        'Web3Connect.Button::Connected to',
                        typeof provider === 'object' ? provider.constructor.name : provider,
                    )
                    const web3 = await getWeb3API({ customProvider: provider }) // add provider to web3
                    setWeb3(web3)
                }}
                onClose={(): void => {
                    console.log('Web3Connect Modal Closed') // modal has closed
                }}
            />
            {web3 && <DisplayWeb3 web3={web3} />}
        </>
    )
}

export default Web3ConnectButton
