import React, { useState } from 'react'

import DisplayWeb3 from './Test_DisplayWeb3'
import Web3 from 'web3'
import { Web3EthereumProvider, provider } from 'web3-providers'

declare global {
    interface Window {
        web3: Web3
        ethereum: Web3EthereumProvider & { enable: () => Promise<[string]> }
    }
}

const connectToInjectedProv = async (): Promise<provider> => {
    if (typeof window.ethereum !== 'undefined') {
        // In the case the user has MetaMask installed, you can easily
        // ask them to sign in and reveal their accounts:
        try {
            await window.ethereum.enable()

            return window.ethereum
        } catch (error) {
            console.warn('error', error)
        }
    } else if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
        return window.web3.currentProvider
    }

    return 'http://localhost:8545'
}

const Web3ProvConnector: React.FC = () => {
    const [web3, setWeb3] = useState<Web3>()

    const connectToProv = async (): Promise<void> => {
        const provider = await connectToInjectedProv()

        console.log(
            'Web3ProvConnector::Connected to',
            typeof provider === 'object' ? provider.constructor.name : provider,
        )

        setWeb3(new Web3(provider))
    }

    return (
        <>
            <button onClick={connectToProv} disabled={!!web3}>
                Connect to injected provider
            </button>
            {web3 && <DisplayWeb3 web3={web3} />}
        </>
    )
}

export default Web3ProvConnector
