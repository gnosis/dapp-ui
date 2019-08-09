import Web3Connect from 'web3connect'
import Web3 from 'web3'
import { provider } from 'web3-providers'

import React, { useState } from 'react'

import DisplayWeb3 from './Test_DisplayWeb3'

const Connector: React.FC = () => {
    const [web3, setWeb3] = useState<Web3>()

    return (
        <>
            <Web3Connect.Button
                providerOptions={{
                    portis: {
                        id: 'PORTIS_ID', // required
                        // network: 'mainnet', // optional
                    },
                    fortmatic: {
                        key: 'FORTMATIC_KEY', // required
                        // network: 'mainnet', // optional
                    },
                }}
                onConnect={(provider: provider): void => {
                    console.log(
                        'Web3Connect.Button::Connected to',
                        typeof provider === 'object' ? provider.constructor.name : provider,
                    )
                    const web3 = new Web3(provider) // add provider to web3
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

export default Connector
